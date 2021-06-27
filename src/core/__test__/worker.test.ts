import { Worker } from "../worker"

declare const global: unknown

describe("worker", () => {
  it("should listen for a fetch event", () => {
    Object.assign(global, { addEventListener: jest.fn() })
    Worker({ handler: jest.fn() })
    expect(addEventListener).toBeCalledWith("fetch", expect.any(Function))
  })
  it("should handle the event request", async () => {
    const handler = jest.fn()
    const worker = Worker({ handler })
    const request = new Request("/")
    const event = new FetchEvent("fetch", { request })
    worker.handle(event)
    expect(handler).toHaveBeenCalledWith(event)
  })
  it("should call the logger if present", async () => {
    const error = new Error()
    const handler = jest.fn(() => {
      throw error
    })
    const logger = jest.fn()
    const worker = Worker({ handler, logger })
    const request = new Request("/")
    const event = new FetchEvent("fetch", { request })
    worker.handle(event)
    expect(handler).toHaveBeenCalledWith(event)
    expect(logger).toHaveBeenCalledWith(event, error)
  })
})
