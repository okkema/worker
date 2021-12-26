import Problem from "./problem"

type RoutedRequest = Request & {
  query?: { [key: string]: string }
  params?: { [key: string]: string }
}

export type RequestHandler = (
  request: RoutedRequest,
) => Promise<Response | void>

type RouteHandler = (path: string, ...handlers: RequestHandler[]) => void

type Router = {
  routes: Route[]
  use: (route: Route) => void
  handle: RequestHandler
  get: RouteHandler
  post: RouteHandler
  put: RouteHandler
  delete: RouteHandler
  all: RouteHandler
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "ALL"

export type Route = {
  method: HttpMethod
  path: string
  handlers: RequestHandler[]
  regex?: RegExp
}

type RouterInit = {
  base: string
  problem?: boolean
}

const Router = (init?: RouterInit): Router => {
  const routes: Route[] = []
  const base = init?.base ?? ""
  const problem = init?.problem ?? true

  const use = (route: Route) => {
    routes.push({
      regex:
        route.regex ??
        RegExp(
          `^${(base + route.path)
            .replace(/(\/?)\*/g, "($1.*)?")
            .replace(/\/$/, "")
            .replace(/:(\w+)(\?)?(\.)?/g, "$2(?<$1>[^/]+)$2$3")
            .replace(/\.(?=[\w(])/, "\\.")}/*$`,
        ),
      ...route,
    })
  }

  return {
    routes,
    use,
    handle: async (request: RoutedRequest) => {
      const url = new URL(request.url)
      request.query = Object.fromEntries(url.searchParams)
      for (const { method, regex, handlers } of routes) {
        const match = url.pathname.match(regex)
        if (match && (method === request.method || method === "ALL")) {
          request.params = match.groups
          for (const handler of handlers) {
            const response = await handler(request)
            if (response !== undefined) return response
          }
        }
      }
      if (problem)
        throw new Problem({
          detail: "The router did not return an response.",
          status: 404,
          title: "Not Found",
        })
    },
    get: (path, ...handlers) =>
      use({
        method: "GET",
        path,
        handlers,
      }),
    post: (path, ...handlers) =>
      use({
        method: "POST",
        path,
        handlers,
      }),
    put: (path, ...handlers) =>
      use({
        method: "PUT",
        path,
        handlers,
      }),
    delete: (path, ...handlers) =>
      use({
        method: "DELETE",
        path,
        handlers,
      }),
    all: (path, ...handlers) =>
      use({
        method: "ALL",
        path,
        handlers,
      }),
  }
}

export default Router
