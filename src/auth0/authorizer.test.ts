/* eslint-disable @typescript-eslint/no-unused-vars */
import { Authorizer } from "./authorizer"
import { validateToken } from "./validator"

jest.mock("./validator", () => ({
  validateToken: jest.fn(),
}))

describe("authorizer", () => {
  it.skip("returns an Unauthorized response when no token is present", async () => {
    const request = new Request("/")
    const audience = "audience"
    const issuer = "issuer"
    const authorizer = Authorizer({ audience, issuer })
    const result = (await authorizer.authorize(request)) as Response
    expect(result).toBeInstanceOf(Response)
    expect(result.status).toBe(401)
    expect(validateToken).not.toHaveBeenCalled()
  })
  it.skip("should return an Unauthorized response when the token is invalid", async () => {
    const token = "token"
    const headers = new Headers({
      Authorization: `Bearer ${token}`,
    })
    const request = new Request("/", { headers })
    const audience = "audience"
    const issuer = "issuer"
    const authorizer = Authorizer({ audience, issuer })
    const mockValidateToken = validateToken as jest.MockedFunction<
      typeof validateToken
    >
    mockValidateToken.mockImplementationOnce((token, audience, issuer) =>
      Promise.resolve(false),
    )
    const result = (await authorizer.authorize(request)) as Response
    expect(result).toBeInstanceOf(Response)
    expect(result.status).toBe(401)
    expect(validateToken).toHaveBeenCalledWith(token, audience, issuer)
  })
  it.skip("should continue if the token is valid", async () => {
    const token = "token"
    const headers = new Headers({
      Authorization: `Bearer ${token}`,
    })
    const request = new Request("/", { headers })
    const audience = "audience"
    const issuer = "issuer"
    const mockValidateToken = validateToken as jest.MockedFunction<
      typeof validateToken
    >
    mockValidateToken.mockImplementationOnce((token, audience, issuer) =>
      Promise.resolve(true),
    )
    const authorizer = Authorizer({ audience, issuer })
    const result = await authorizer.authorize(request)
    expect(result).toBe(undefined)
    expect(validateToken).toHaveBeenCalledWith(token, audience, issuer)
  })
})
