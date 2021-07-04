import { Logger } from "../logger"

describe("logger", () => {
  it("should return true if it successfully logs the error", async () => {
    Object.assign(global, {
      fetch: jest.fn(() => {
        return { ok: true }
      }),
    })
    const request = new Request("/")
    const event = new FetchEvent("fetch", { request })
    const error = new Error()
    const DSN = "http://localhost"
    const logger = Logger({ DSN })
    const result = await logger.log(event, error)
    expect(result).toBe(true)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(DSN),
      expect.any(Object),
    )
  })
  it("should return false if it is unable to log an error", async () => {
    Object.assign(global, {
      fetch: jest.fn(() => {
        return { ok: false }
      }),
    })
    const request = new Request("/")
    const event = new FetchEvent("fetch", { request })
    const error = new Error()
    const DSN = "http://localhost"
    const logger = Logger({ DSN })
    const result = await logger.log(event, error)
    expect(result).toBe(false)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(DSN),
      expect.any(Object),
    )
  })
})
