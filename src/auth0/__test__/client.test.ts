import { Auth0ClientError, fetchJWKS } from "../client"

describe("client", () => {
  it("should return a JWKS", async () => {
    const issuer = "http://localhost"
    const jwks = jest.fn()
    const json = jest.fn(() => jwks)
    const fetch = jest.fn(() => {
      return { ok: true, json }
    })
    Object.assign(global, {
      fetch,
    })
    const result = await fetchJWKS(issuer)
    expect(result).toBe(jwks)
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining(issuer))
    expect(json).toHaveBeenCalled()
  })
  it("should throw an error", async () => {
    const issuer = "http://localhost"
    const json = jest.fn()
    const fetch = jest.fn(() => {
      return { ok: false, json }
    })
    Object.assign(global, {
      fetch,
    })
    await expect(fetchJWKS(issuer)).rejects.toThrow(Auth0ClientError)
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining(issuer))
    expect(json).not.toHaveBeenCalled()
  })
})
