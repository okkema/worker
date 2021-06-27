import {
  BadRequest,
  Forbidden,
  InternalServerError,
  NoContent,
  NotFound,
  Ok,
  Unauthorized,
} from "../responses"

describe("responses", () => {
  it("should return an 200 OK", () => {
    const result = Ok()
    expect(result.status).toBe(200)
    expect(result.statusText).toBe("OK")
  })
  it("should return a 204 No Content", () => {
    const result = NoContent()
    expect(result.status).toBe(204)
    expect(result.statusText).toBe("No Content")
  })
  it("should return a 400 Bad Request", () => {
    const result = BadRequest()
    expect(result.status).toBe(400)
    expect(result.statusText).toBe("Bad Request")
  })
  it("should return a 401 Unauthorized", () => {
    const result = Unauthorized()
    expect(result.status).toBe(401)
    expect(result.statusText).toBe("Unauthorized")
  })
  it("should return a 403 Forbidden", () => {
    const result = Forbidden()
    expect(result.status).toBe(403)
    expect(result.statusText).toBe("Forbidden")
  })
  it("should return a 404 Not Found", () => {
    const result = NotFound()
    expect(result.status).toBe(404)
    expect(result.statusText).toBe("Not Found")
  })
  it("should return a 500 Internal Server Error", () => {
    const result = InternalServerError()
    expect(result.status).toBe(500)
    expect(result.statusText).toBe("Internal Server Error")
  })
})
