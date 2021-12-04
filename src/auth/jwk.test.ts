import JWK from "./jwk"
import { Problem } from "../core"

describe("JWK", () => {
  describe("fetch", () => {
    it("returns a JWKS", async () => {
      const issuer = "http://localhost"
      const jwks = jest.fn()
      const json = jest.fn(() => jwks)
      const fetch = jest.fn(() => {
        return { ok: true, json }
      })
      Object.assign(global, {
        fetch,
      })
      const result = await JWK.fetch(issuer)
      expect(result).toBe(jwks)
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining(issuer))
      expect(json).toHaveBeenCalled()
    })
    it("throws an error when response not ok", async () => {
      const issuer = "http://localhost"
      const json = jest.fn()
      const fetch = jest.fn(() => {
        return { ok: false, json }
      })
      Object.assign(global, {
        fetch,
      })
      await expect(JWK.fetch(issuer)).rejects.toThrow(Problem)
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining(issuer))
      expect(json).not.toHaveBeenCalled()
    })
  })
})
