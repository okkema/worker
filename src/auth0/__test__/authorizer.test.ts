import { Authorizer } from "../authorizer"

describe("authorizer", () => {
  it("should return an Unauthorized response when no token is present", async () => {
    const request = new Request("/")
    const validator = jest.fn()
    const authorizer = Authorizer({ validator })
    const result = (await authorizer.authorize(request)) as Response
    expect(result).toBeInstanceOf(Response)
    expect(result.status).toBe(401)
    expect(validator).not.toHaveBeenCalled()
  })
  it("should return an Unauthorized response when the token is invalid", async () => {
    const token = "token"
    const headers = new Headers({
      Authorization: `Bearer ${token}`,
    })
    const request = new Request("/", { headers })
    const validator = jest.fn(() => Promise.resolve(false))
    const authorizer = Authorizer({ validator })
    const result = (await authorizer.authorize(request)) as Response
    expect(result).toBeInstanceOf(Response)
    expect(result.status).toBe(401)
    expect(validator).toHaveBeenCalledWith(token)
  })
  it("should continue if the token is valid", async () => {
    const token = "token"
    const headers = new Headers({
      Authorization: `Bearer ${token}`,
    })
    const request = new Request("/", { headers })
    const validator = jest.fn(() => Promise.resolve(true))
    const authorizer = Authorizer({ validator })
    const result = await authorizer.authorize(request)
    expect(result).toBe(undefined)
    expect(validator).toHaveBeenCalledWith(token)
  })
})
