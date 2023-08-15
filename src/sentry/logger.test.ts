import { SentryLogger } from "./logger"

describe("logger", () => {
  it("calls the Sentry API", async () => {
    Object.assign(global, {
      fetch: jest.fn(),
    })
    const request = new Request("/")
    const error = new Error()
    const DSN = "http://localhost"
    const logger = SentryLogger({ DSN })
    await logger.error(request, error)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(DSN),
      expect.any(Object),
    )
  })
  it("returns response ok", async () => {
    const ok = true
    Object.assign(global, {
      fetch: jest.fn(() => {
        return { ok }
      }),
    })
    const request = new Request("/")
    const error = new Error()
    const DSN = "http://localhost"
    const logger = SentryLogger({ DSN })
    const result = await logger.error(request, error)
    expect(result).toBe(ok)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(DSN),
      expect.any(Object),
    )
  })
  it("returns false on error", async () => {
    Object.assign(global, {
      fetch: jest.fn(() => {
        throw new Error()
      }),
    })
    const request = new Request("/")
    const error = new Error()
    const DSN = "http://localhost"
    const logger = SentryLogger({ DSN })
    const result = await logger.error(request, error)
    expect(result).toBe(false)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(DSN),
      expect.any(Object),
    )
  })
})
