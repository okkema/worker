import Problem from "./problem"

export type RoutedRequest = Request & {
  query?: { [key: string]: string }
  params?: { [key: string]: string }
}

type RequestHandler = (request: RoutedRequest) => Promise<Response>

type Router = {
  routes: Route[]
  handle: RequestHandler
  use: (route: Route) => void
  get: (path: string, ...handlers: RequestHandler[]) => void
  post: (path: string, ...handlers: RequestHandler[]) => void
  put: (path: string, ...handlers: RequestHandler[]) => void
  del: (path: string, ...handlers: RequestHandler[]) => void
  all: (path: string, ...handlers: RequestHandler[]) => void
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "ALL"

export type Route = {
  method: HttpMethod
  path: string
  handlers: RequestHandler[]
  regex?: RegExp
}

const Router = (): Router => {
  const routes: Route[] = []

  const use = (route: Route) => {
    routes.push({
      regex:
        route.regex ??
        RegExp(
          `^${route.path
            .replace(/(\/?)\*/g, "($1.*)?")
            .replace(/\/$/, "")
            .replace(/:(\w+)(\?)?(\.)?/g, "$2(?<$1>[^/]+)$2$3")
            .replace(/\.(?=[\w(])/, "\\.")}/*$`,
        ),
      ...route,
    })
  }

  const get = (path: string, ...handlers: RequestHandler[]) =>
    use({
      method: "GET",
      path,
      handlers,
    })

  const post = (path: string, ...handlers: RequestHandler[]) =>
    use({
      method: "POST",
      path,
      handlers,
    })

  const put = (path: string, ...handlers: RequestHandler[]) =>
    use({
      method: "PUT",
      path,
      handlers,
    })

  const del = (path: string, ...handlers: RequestHandler[]) =>
    use({
      method: "DELETE",
      path,
      handlers,
    })

  const all = (path: string, ...handlers: RequestHandler[]) =>
    use({
      method: "ALL",
      path,
      handlers,
    })

  const handle = async (request: RoutedRequest) => {
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
        throw new Problem({
          detail: "Please contact the admin with the request details.",
          status: 500,
          title: "The route handlers did not return a response",
          type: "NoResponse",
        })
      }
    }
  }

  return {
    routes,
    handle,
    use,
    get,
    post,
    put,
    del,
    all,
  }
}

export default Router
