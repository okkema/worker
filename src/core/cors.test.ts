import CORS from "./cors"

describe("CORS", () => {
  it("clones the response", () => {
    const request = new Request("/")
    const response = new Response()
    const result = CORS(request, response, {})
    expect(result).not.toBe(response)
  })
  it("uses the defaults", () => {
    const request = new Request("/")
    const response = new Response()
    const result = CORS(request, response, {})
    expect(result.headers.get("Access-Control-Allow-Origin")).toBe("*")
  })
  it("sets the allowed origin", () => {
    const request = new Request("/")
    const response = new Response()
    const origin = "http://localhost"
    const result = CORS(request, response, { origin })
    expect(result.headers.get("Access-Control-Allow-Origin")).toBe(origin)
  })
  describe("preflight", () => {
    it("uses the defaults", () => {
      const request = new Request("/", { method: "OPTIONS" })
      const response = new Response()
      const result = CORS(request, response, {})
      expect(result.headers.get("Access-Control-Allow-Methods")).toBe("*")
      expect(result.headers.get("Access-Control-Allow-Headers")).toBe("*")
    })
    it("sets the allowed methods", () => {
      const request = new Request("/", { method: "OPTIONS" })
      const response = new Response()
      const result = CORS(request, response, { methods: ["GET", "POST"] })
      expect(result.headers.get("Access-Control-Allow-Methods")).toBe(
        "GET, POST",
      )
    })
    it("sets the allowed headers", () => {
      const request = new Request("/", { method: "OPTIONS" })
      const response = new Response()
      const result = CORS(request, response, {
        headers: ["X-Test1", "X-Test2"],
      })
      expect(result.headers.get("Access-Control-Allow-Headers")).toBe(
        "X-Test1, X-Test2",
      )
    })
  })
})
