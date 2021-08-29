import Problem from "./problem"
import Worker from "./worker"

declare const global: unknown

describe("worker", () => {
  it("listens for a fetch event", () => {
    Object.assign(global, { addEventListener: jest.fn() })
    Worker({ handler: jest.fn() })
    expect(addEventListener).toBeCalledWith("fetch", expect.any(Function))
  })
  it("calls the handler", async () => {
    const handler = jest.fn()
    const worker = Worker({ handler })
    const request = new Request("/")
    const event = new FetchEvent("fetch", { request })
    worker.handleEvent(event)
    expect(handler).toHaveBeenCalledWith(event)
  })
  it("responds to an event", async () => {
    const response = new Response()
    const handler = jest.fn(async () => response)
    const worker = Worker({ handler })
    const request = new Request("/")
    const event = new FetchEvent("fetch", { request })
    event.respondWith = jest.fn()
    const result = await worker.handleEvent(event)
    expect(handler).toHaveBeenCalledWith(event)
    expect(result).toBe(response)
  })
  describe("on error", () => {
    it("calls the logger if present", async () => {
      const error = new Error()
      const handler = jest.fn(() => {
        throw error
      })
      const logError = jest.fn()
      const worker = Worker({ handler, logger: { logError } })
      const request = new Request("/")
      const event = new FetchEvent("fetch", { request })
      worker.handleEvent(event)
      expect(handler).toHaveBeenCalledWith(event)
      expect(logError).toHaveBeenCalledWith(event, error)
    })
    it("returns problem details if expected", async () => {
      const init = {
        detail: "detail",
        status: 500,
        title: "title",
        type: "type",
      }
      const error = new Problem(init)
      const handler = jest.fn(() => {
        throw error
      })
      const worker = Worker({ handler })
      const request = new Request("/")
      const event = new FetchEvent("fetch", { request })
      const result = await worker.handleEvent(event)
      expect(handler).toHaveBeenCalledWith(event)
      expect(result.status).toBe(error.status)
      expect(result.statusText).toBe("Problem Details")
      const json = await result.json()
      expect(json).toEqual(init)
    })
    it("returns an internal server error if unexpected", async () => {
      const error = new Error("error")
      const handler = jest.fn(() => {
        throw error
      })
      const worker = Worker({ handler })
      const request = new Request("/")
      const event = new FetchEvent("fetch", { request })
      const result = await worker.handleEvent(event)
      expect(handler).toHaveBeenCalledWith(event)
      expect(result.status).toBe(500)
      expect(result.statusText).toBe("Internal Server Error")
      const text = await result.text()
      expect(text).toBe(error.message)
    })
  })
})
