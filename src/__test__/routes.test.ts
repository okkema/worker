import { router } from "../routes"

describe("routes", () => {
  it("should return a 200", async () => {
    const result: Response = await router.handle(
      new Request("/", { method: "GET" }),
    )
    expect(result.status).toBe(200)
  })
})
