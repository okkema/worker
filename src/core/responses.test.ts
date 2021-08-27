import CoreError from "./error"
import {
  BadRequest,
  Forbidden,
  InternalServerError,
  NoContent,
  NotFound,
  Ok,
  ProblemDetails,
  Unauthorized,
} from "./responses"

describe("responses", () => {
  it("returns an 200 OK", () => {
    const result = Ok()
    expect(result.status).toBe(200)
    expect(result.statusText).toBe("OK")
  })
  it("returns a 204 No Content", () => {
    const result = NoContent()
    expect(result.status).toBe(204)
    expect(result.statusText).toBe("No Content")
  })
  it("returns a 400 Bad Request", () => {
    const result = BadRequest()
    expect(result.status).toBe(400)
    expect(result.statusText).toBe("Bad Request")
  })
  it("returns a 401 Unauthorized", () => {
    const result = Unauthorized()
    expect(result.status).toBe(401)
    expect(result.statusText).toBe("Unauthorized")
  })
  it("returns a 403 Forbidden", () => {
    const result = Forbidden()
    expect(result.status).toBe(403)
    expect(result.statusText).toBe("Forbidden")
  })
  it("returns a 404 Not Found", () => {
    const result = NotFound()
    expect(result.status).toBe(404)
    expect(result.statusText).toBe("Not Found")
  })
  it("returns a 500 Internal Server Error", () => {
    const result = InternalServerError()
    expect(result.status).toBe(500)
    expect(result.statusText).toBe("Internal Server Error")
  })
  it("returns Problem Details", async () => {
    const init = {
      detail: "detail",
      status: 400,
      title: "title",
      type: "type",
    }
    const result = ProblemDetails(new CoreError(init))
    expect(result.status).toBe(init.status)
    expect(result.statusText).toBe(CoreError.name)
    const json = await result.json()
    expect(json).toEqual(init)
  })
})
