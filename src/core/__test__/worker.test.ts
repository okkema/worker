import { Worker } from "../worker"

declare const global: unknown

describe("worker", () => {
  beforeEach(() => {
    Object.assign(global, { addEventListener: jest.fn() })
  })
  it("should listen for a fetch event", () => {
    const worker = Worker(jest.fn())
    worker.listen()
    expect(addEventListener).toBeCalledWith("fetch", worker.eventHandler)
  })
  it("should handle the event request", async () => {
    const handler = jest.fn()
    const worker = Worker(handler)
    const request = new Request("/")
    const event = new FetchEvent("fetch", { request })
    worker.eventHandler(event)
    expect(handler).toHaveBeenCalledWith(request)
  })
})
