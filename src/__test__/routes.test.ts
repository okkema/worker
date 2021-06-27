import { handler } from "../routes"

describe("routes", () => {
  it("should return a 200", async () => {
    const request = new Request("/", { method: "GET" })
    const event = new FetchEvent("fetch", { request })
    const result: Response = await handler(event)
    expect(result.status).toBe(200)
  })
  it("should throw an error", async () => {
    const request = new Request("/error", { method: "GET" })
    const event = new FetchEvent("fetch", { request })
    await expect(handler(event)).rejects.toThrow(Error)
  })
})
