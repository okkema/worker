import Problem from "./problem"
import Worker from "./worker"

declare const global: unknown

describe("worker", () => {
  it("throws a problem if no handlers are registered", () => {
    expect(() => Worker({})).toThrow(Problem)
  })
  it("does not attach listeners when specified", () => {
    Object.assign(global, { addEventListener: jest.fn() })
    Worker({ fetch: jest.fn(), scheduled: jest.fn(), listen: false })
    expect(addEventListener).not.toBeCalled()
  })
  describe("fetch", () => {
    it("listens for an event", () => {
      Object.assign(global, { addEventListener: jest.fn() })
      Worker({ fetch: jest.fn() })
      expect(addEventListener).toBeCalledWith("fetch", expect.any(Function))
    })
    it("calls the handler", async () => {
      const fetch = jest.fn()
      const worker = Worker({ fetch })
      const request = new Request("/")
      const event = new FetchEvent("fetch", { request })
      worker.fetch(event)
      expect(fetch).toHaveBeenCalledWith(event)
    })
    it("responds to an event", async () => {
      const response = new Response()
      const fetch = jest.fn(async () => response)
      const worker = Worker({ fetch })
      const request = new Request("/")
      const event = new FetchEvent("fetch", { request })
      event.respondWith = jest.fn()
      const result = await worker.fetch(event)
      expect(fetch).toHaveBeenCalledWith(event)
      expect(result).toBe(response)
    })
    describe("on error", () => {
      it("calls the logger if present", async () => {
        const err = new Error()
        const fetch = jest.fn(() => {
          throw err
        })
        const error = jest.fn()
        const worker = Worker({ fetch, logger: { error } })
        const request = new Request("/")
        const event = new FetchEvent("fetch", { request })
        worker.fetch(event)
        expect(fetch).toHaveBeenCalledWith(event)
        expect(error).toHaveBeenCalledWith(event, err)
      })
      it("returns problem details if expected", async () => {
        const init = {
          detail: "detail",
          status: 500,
          title: "title",
          type: "type",
        }
        const error = new Problem(init)
        const fetch = jest.fn(() => {
          throw error
        })
        const worker = Worker({ fetch })
        const request = new Request("/")
        const event = new FetchEvent("fetch", { request })
        const result = await worker.fetch(event)
        expect(fetch).toHaveBeenCalledWith(event)
        expect(result.status).toBe(error.status)
        expect(result.statusText).toBe("Problem Details")
        const json = await result.json()
        expect(json).toEqual(init)
      })
      it("returns an 500 if unexpected", async () => {
        const error = new Error("error")
        const fetch = jest.fn(() => {
          throw error
        })
        const worker = Worker({ fetch })
        const request = new Request("/")
        const event = new FetchEvent("fetch", { request })
        const result = await worker.fetch(event)
        expect(fetch).toHaveBeenCalledWith(event)
        expect(result.status).toBe(500)
        const text = await result.text()
        expect(text).toBe(error.message)
      })
    })
  })
  describe("scheduled", () => {
    it("listens for an event", () => {
      Object.assign(global, { addEventListener: jest.fn() })
      Worker({ scheduled: jest.fn() })
      expect(addEventListener).toBeCalledWith("scheduled", expect.any(Function))
    })
    it("calls the handler", async () => {
      const scheduled = jest.fn()
      const worker = Worker({ scheduled })
      const event = jest.fn()
      await worker.scheduled(event as never)
      expect(scheduled).toHaveBeenCalledWith(event)
    })
    describe("on error", () => {
      it("catches and forwards the error", async () => {
        const err = new Error()
        const scheduled = jest.fn(() => {
          throw err
        })
        const worker = Worker({ scheduled })
        const event = {
          waitUntil: jest.fn(),
        }
        await expect(worker.scheduled(event as never)).rejects.toThrow(Error)
        expect(scheduled).toHaveBeenCalledWith(event)
      })
      it("calls the logger if present", async () => {
        const err = new Error()
        const scheduled = jest.fn(() => {
          throw err
        })
        const error = jest.fn()
        const worker = Worker({ scheduled, logger: { error } })
        const event = {
          waitUntil: jest.fn(),
        }
        await expect(worker.scheduled(event as never)).rejects.toThrow(Error)
        expect(scheduled).toHaveBeenCalledWith(event)
        expect(error).toHaveBeenCalledWith(event, err)
      })
    })
  })
})
