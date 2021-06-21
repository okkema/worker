import { Ok } from "../responses"

describe("responses", () => {
  it("should return an Ok", () => {
    const result = Ok()
    expect(result.status).toBe(200)
    expect(result.statusText).toBe("Ok")
  })
})