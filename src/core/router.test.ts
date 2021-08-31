import Problem from "./problem"
import Router, { Route, RoutedRequest } from "./router"

describe("Router", () => {
  describe("routes", () => {
    it("initializes with no routes", () => {
      const router = Router()
      expect(router.routes.length).toBe(0)
    })
  })
  describe("useRoute", () => {
    it("registers the route", () => {
      const router = Router()
      const route: Route = {
        path: "/",
        method: "GET",
        handlers: [],
      }
      router.useRoute(route)
      expect(router.routes[0]).toEqual(expect.objectContaining(route))
    })
    it("stores the routes in the same order they were registered", () => {
      const router = Router()
      const route1: Route = {
        path: "/1",
        method: "GET",
        handlers: [],
      }
      const route2: Route = {
        path: "/2",
        method: "POST",
        handlers: [],
      }
      router.useRoute(route1)
      router.useRoute(route2)
      expect(router.routes[0]).toEqual(expect.objectContaining(route1))
      expect(router.routes[1]).toEqual(expect.objectContaining(route2))
    })
    it("creates regex for the route path", () => {
      const router = Router()
      const route: Route = {
        path: "/",
        method: "GET",
        handlers: [],
      }
      router.useRoute(route)
      expect(router.routes[0].regex).toBeDefined()
      expect(router.routes[0].regex).toBeInstanceOf(RegExp)
    })
    it("accepts custom route regex", () => {
      const router = Router()
      const regex = new RegExp(/\test$/)
      const route: Route = {
        path: "/",
        method: "GET",
        handlers: [],
        regex,
      }
      router.useRoute(route)
      expect(router.routes[0].regex).toBe(regex)
    })
  })
  describe("handleRoute", () => {
    it("calls the handler on a match", async () => {
      const router = Router()
      const handler = jest.fn()
      handler.mockImplementationOnce(() => new Response())
      const route: Route = {
        path: "/",
        method: "GET",
        handlers: [handler],
      }
      router.useRoute(route)
      const request = new Request("/")
      await router.handleRequest(request)
      expect(handler).toHaveBeenCalledTimes(1)
    })
    it("attaches the query and params to the request", async () => {
      const router = Router()
      const handler = jest.fn()
      handler.mockImplementationOnce((request: RoutedRequest) => {
        expect(request.params).toEqual({ id: "123" })
        expect(request.query).toEqual({ key: "value" })
        return new Response()
      })
      const route: Route = {
        path: "/:id",
        method: "GET",
        handlers: [handler],
      }
      router.useRoute(route)
      const request = new Request("/123?key=value")
      await router.handleRequest(request)
    })
    it("requires an exact match", async () => {
      const router = Router()
      const handler = jest.fn()
      const route: Route = {
        path: "/",
        method: "GET",
        handlers: [handler],
      }
      router.useRoute(route)
      const request = new Request("/test")
      await router.handleRequest(request)
      expect(handler).not.toHaveBeenCalled()
    })
    it("returns the first match found", async () => {
      const router = Router()
      const handler1 = jest.fn()
      handler1.mockImplementationOnce(() => new Response())
      const route1: Route = {
        path: "/test/first",
        method: "GET",
        handlers: [handler1],
      }
      const handler2 = jest.fn()
      handler2.mockImplementationOnce(() => new Response())
      const route2: Route = {
        path: "/test/:any",
        method: "GET",
        handlers: [handler2],
      }
      router.useRoute(route1)
      router.useRoute(route2)
      const request = new Request("/test/first")
      await router.handleRequest(request)
      expect(handler1).toHaveBeenCalledTimes(1)
      expect(handler2).not.toHaveBeenCalled()
    })
    it("matches any method with 'ALL'", async () => {
      const router = Router()
      const handler = jest.fn()
      handler.mockImplementation(() => new Response())
      const route: Route = {
        path: "/",
        method: "ALL",
        handlers: [handler],
      }
      router.useRoute(route)
      const request1 = new Request("/", { method: "GET" })
      await router.handleRequest(request1)
      const request2 = new Request("/", { method: "POST" })
      await router.handleRequest(request2)
      const request3 = new Request("/", { method: "PUT" })
      await router.handleRequest(request3)
      const request4 = new Request("/", { method: "DELETE" })
      await router.handleRequest(request4)
      expect(handler).toHaveBeenCalledTimes(4)
    })
    it("calls the handlers in order", async () => {
      const router = Router()
      const handler1 = jest.fn()
      handler1.mockImplementationOnce((request) => {
        expect(request.prev).toBeUndefined()
        request.prev = 1
      })
      const handler2 = jest.fn()
      handler2.mockImplementationOnce((request) => {
        expect(request.prev).toBe(1)
        request.prev = 2
      })
      const handler3 = jest.fn()
      handler3.mockImplementationOnce((request) => {
        expect(request.prev).toBe(2)
        return new Response()
      })
      const route: Route = {
        path: "/",
        method: "GET",
        handlers: [handler1, handler2, handler3],
      }
      router.useRoute(route)
      const request = new Request("/")
      await router.handleRequest(request)
      expect(handler1).toHaveBeenCalledTimes(1)
      expect(handler2).toHaveBeenCalledTimes(1)
      expect(handler3).toHaveBeenCalledTimes(1)
    })
    it("short circuits if a handler returns early", async () => {
      const router = Router()
      const handler1 = jest.fn()
      const handler2 = jest.fn()
      handler2.mockImplementationOnce(() => {
        return true
      })
      const handler3 = jest.fn()
      const route: Route = {
        path: "/",
        method: "GET",
        handlers: [handler1, handler2, handler3],
      }
      router.useRoute(route)
      const request = new Request("/")
      await router.handleRequest(request)
      expect(handler1).toHaveBeenCalledTimes(1)
      expect(handler2).toHaveBeenCalledTimes(1)
      expect(handler3).not.toHaveBeenCalled()
    })
    it("throws a problem if a route does not return a response", async () => {
      const router = Router()
      const route: Route = {
        path: "/",
        method: "GET",
        handlers: [],
      }
      router.useRoute(route)
      const request = new Request("/")
      await expect(router.handleRequest(request)).rejects.toThrowError(Problem)
    })
    describe("regex", () => {
      it("supports allowed characters", async () => {
        const router = Router()
        const path = "/foo/-.abc!@%&_=:;',~|/bar"
        const handler = jest.fn()
        handler.mockImplementation(
          (request: RoutedRequest) =>
            new Response(JSON.stringify(request.params)),
        )
        const route: Route = {
          path: path,
          method: "GET",
          handlers: [handler],
        }
        router.useRoute(route)
        const request = new Request(path)
        await router.handleRequest(request)
        expect(handler).toHaveBeenCalledTimes(1)
      })
      it.todo("supports file extensions")
      it.todo("supports optional params")
      it.todo("supports optional trailing slashes")
      it.todo("supports wildcards")
    })
  })
})
