import { handler } from "../routes"

describe("routes", () => {
  it("should return a 200", async () => {
    const request = new Request("/", { method: "GET" })
    const result: Response = await handler(new FetchEvent("fetch", { request }))
    expect(result.status).toBe(200)
  })
})
