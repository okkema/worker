import { describe, it, expect, vitest, type MockedFunction } from "vitest"
import { JWT } from "./jwt"
import { JWK } from "./jwk"
import { Problem } from "../core"

const KEYID = "keyid123"
const AUDIENCE = "https://audience"
const ISSUER = "https://issuer/"

vitest.mock("./jwk", () => ({
  JWK: {
    fetch: vitest.fn(),
    import: vitest.fn(),
    url: vitest.fn(),
  },
}))

const createJWT = () => ({
  decoded: {
    header: {
      alg: "RS256",
      kid: KEYID,
      typ: "JWT",
    },
    payload: {
      aud: [AUDIENCE],
      exp: Date.now() / 1000 + 1000,
      iss: ISSUER,
      sub: "subject",
    },
    signature: new Uint8Array(),
  },
  raw: {
    header: "",
    payload: "",
    signature: "",
  },
})

describe("JWT", () => {
  describe("sign", () => {
    it("creates and signs a valid token", async () => {
      const key = await crypto.subtle.generateKey(
        {
          name: "RSASSA-PKCS1-v1_5",
          modulusLength: 4096,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["sign"],
      )
      const buffer = await crypto.subtle.exportKey("pkcs8", key.privateKey)
      const pemKey =
        "-----BEGIN PRIVATE KEY-----\n" +
        btoa(String.fromCharCode.apply(null, new Uint8Array(buffer))) +
        "\n-----END PRIVATE KEY-----"
      const result = await JWT.sign(pemKey, KEYID, AUDIENCE, ISSUER)
      expect(result).toBeDefined()
    })
  })
  describe("decode", () => {
    it("decodes a valid token", () => {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
      const result = JWT.decode(token)
      expect(result).toBeDefined()
      expect(result).toMatchInlineSnapshot(`
        {
          "decoded": {
            "header": {
              "alg": "HS256",
              "typ": "JWT",
            },
            "payload": {
              "iat": 1516239022,
              "name": "John Doe",
              "sub": "1234567890",
            },
            "signature": Uint8Array [
              73,
              249,
              74,
              199,
              4,
              73,
              72,
              199,
              138,
              40,
              93,
              144,
              79,
              135,
              240,
              164,
              199,
              137,
              127,
              126,
              143,
              58,
              78,
              178,
              37,
              95,
              218,
              117,
              11,
              44,
              195,
              151,
            ],
          },
          "raw": {
            "header": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
            "payload": "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ",
            "signature": "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
          },
        }
      `)
    })
    it("throws an error when token is invalid", () => {
      const token = "some.bad.token"
      expect(() => JWT.decode(token)).toThrow(Problem)
    })
  })

  describe("validate", () => {
    describe("header", () => {
      it("throws an error if the type is invalid", async () => {
        const audience = "audience"
        const issuer = "issuer"
        const jwt = createJWT()
        jwt.decoded.header.typ = "invalid"
        await expect(JWT.validate(jwt, audience, issuer)).rejects.toThrow(
          Problem,
        )
      })
      it("throws an error if the algorithm is invalid", async () => {
        const audience = "audience"
        const issuer = "issuer"
        const jwt = createJWT()
        jwt.decoded.header.alg = "invalid"
        await expect(JWT.validate(jwt, audience, issuer)).rejects.toThrow(
          Problem,
        )
      })
      it("throws an error if the key id is missing", async () => {
        const audience = "audience"
        const issuer = "issuer"
        const jwt = createJWT()
        jwt.decoded.header.kid = ""
        await expect(JWT.validate(jwt, audience, issuer)).rejects.toThrow(
          Problem,
        )
      })
    })
    describe("payload", () => {
      it("throws an error if the audience is invalid", async () => {
        const audience = "audience"
        const issuer = "issuer"
        const jwt = createJWT()
        jwt.decoded.payload.aud = ["invalid"]
        await expect(JWT.validate(jwt, audience, issuer)).rejects.toThrow(
          Problem,
        )
      })
      it("throws an error if the issuer is invalid", async () => {
        const audience = "audience"
        const issuer = "issuer"
        const jwt = createJWT()
        jwt.decoded.payload.iss = "invalid"
        await expect(JWT.validate(jwt, audience, issuer)).rejects.toThrow(
          Problem,
        )
      })
      it("throws an error if the expiration is missing", async () => {
        const audience = "audience"
        const issuer = "issuer"
        const jwt = createJWT()
        jwt.decoded.payload.exp = 0
        await expect(JWT.validate(jwt, audience, issuer)).rejects.toThrow(
          Problem,
        )
      })
      it("throws an error if the jwt is expired", async () => {
        const audience = "audience"
        const issuer = "issuer"
        const jwt = createJWT()
        jwt.decoded.payload.exp = new Date(Date.now()).getUTCSeconds()
        await expect(JWT.validate(jwt, audience, issuer)).rejects.toThrow(
          Problem,
        )
      })
    })
    describe("signature", () => {
      it("throws an error if no matching key is found", async () => {
        const audience = "audience"
        const issuer = "issuer"
        const jwt = createJWT()
        const mockFetch = JWK.fetch as MockedFunction<typeof JWK.fetch>
        mockFetch.mockImplementationOnce(async () => ({
          keys: [vitest.fn() as any], // eslint-disable-line @typescript-eslint/no-explicit-any
        }))
        const mockImport = JWK.import as MockedFunction<typeof JWK.import>
        mockImport.mockImplementationOnce(async () => ({
          kid: "",
          key: vitest.fn() as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        }))
        await expect(JWT.validate(jwt, audience, issuer)).rejects.toThrow(
          Problem,
        )
        expect(mockFetch).toHaveBeenCalled()
        expect(mockImport).toHaveBeenCalled()
      })
      it.todo("throws an error if the signature is invalid")
    })
    it.todo("validates the token")
    describe("options", () => {
      it.todo("calls the JWK URL")
      it.todo("skips appending the issuer")
      it.todo("skips prepending the audience")
    })
  })

  describe("get", () => {
    it("throws an error if missing auth header", () => {
      const request = new Request("http://localhost")
      expect(() => JWT.get(request)).toThrowError(Problem)
    })
    it("throws an error if unable parse auth header", () => {
      const request = new Request("http://localhost", {
        headers: { Authorization: "whatever" },
      })
      expect(() => JWT.get(request)).toThrowError(Problem)
    })
    it("throws an error if auth header is invalid", () => {
      const request = new Request("http://localhost", {
        headers: {
          Authorization: "Basic Z3Vlc3Q6Z3Vlc3Q=",
        },
      })
      expect(() => JWT.get(request)).toThrowError(Problem)
    })
    it("returns the token", () => {
      const token = "token"
      const request = new Request("http://localhost", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const result = JWT.get(request)
      expect(result).toBe(token)
    })
  })
})
