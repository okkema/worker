import JWT from "./jwt"
import { Problem } from "../core"

jest.mock("./jwt", () => {
  const JWT = jest.requireActual("./jwt").default
  return { ...JWT, decode: jest.fn(JWT.decode) }
})

const createJWT = () => ({
  header: {
    alg: "RS256",
    kid: "",
    typ: "JWT",
  },
  payload: {
    aud: "audience",
    exp: Date.now() + 1000,
    iss: "issuer",
    sub: "subject",
  },
  signature: "",
})

describe("JWT", () => {
  describe("decode", () => {
    it("decodes a valid token", () => {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
      const result = JWT.decode(token)
      expect(result).toBeDefined()
      expect(result).toMatchSnapshot()
    })
    it("throws an error when token is invalid", () => {
      const token = "some.bad.token"
      expect(() => JWT.decode(token)).toThrow(Problem)
    })
  })

  describe("validate", () => {
    it("throws an error if the type is invalid", async () => {
      const token = "token"
      const audience = "audience"
      const issuer = "issuer"
      // const jwt = createJWT()
      // jwt.header.typ = "invalid"
      // const mockDecode = JWT.decode as jest.MockedFunction<typeof JWT.decode>
      // mockDecode.mockImplementationOnce((token) => jwt)
      await expect(JWT.validate(token, audience, issuer)).rejects.toThrow(
        Problem,
      )
    })
    it("throws an error if the algorithm is invalid", async () => {
      const token = "token"
      const audience = "audience"
      const issuer = "issuer"
      const jwt = createJWT()
      jwt.header.alg = "invalid"
      const mockDecode = JWT.decode as jest.MockedFunction<typeof JWT.decode>
      mockDecode.mockImplementationOnce((token) => jwt)
      await expect(JWT.validate(token, audience, issuer)).rejects.toThrow(
        Problem,
      )
    })
    it("throws an error if the key id is missing", async () => {
      const token = "token"
      const audience = "audience"
      const issuer = "issuer"
      const jwt = createJWT()
      jwt.header.kid = ""
      const mockDecode = JWT.decode as jest.MockedFunction<typeof JWT.decode>
      mockDecode.mockImplementationOnce((token) => jwt)
      await expect(JWT.validate(token, audience, issuer)).rejects.toThrow(
        Problem,
      )
    })
    it("throws an error if the audience is invalid", async () => {
      const token = "token"
      const audience = "audience"
      const issuer = "issuer"
      const jwt = createJWT()
      jwt.payload.aud = "invalid"
      const mockDecode = JWT.decode as jest.MockedFunction<typeof JWT.decode>
      mockDecode.mockImplementationOnce((token) => jwt)
      await expect(JWT.validate(token, audience, issuer)).rejects.toThrow(
        Problem,
      )
    })
    it("throws an error if the issuer is invalid", async () => {
      const token = "token"
      const audience = "audience"
      const issuer = "issuer"
      const jwt = createJWT()
      jwt.payload.iss = "invalid"
      const mockDecode = JWT.decode as jest.MockedFunction<typeof JWT.decode>
      mockDecode.mockImplementationOnce((token) => jwt)
      await expect(JWT.validate(token, audience, issuer)).rejects.toThrow(
        Problem,
      )
    })
    it("throws an error if the expiration is missing", async () => {
      const token = "token"
      const audience = "audience"
      const issuer = "issuer"
      const jwt = createJWT()
      jwt.payload.exp = 0
      const mockDecode = JWT.decode as jest.MockedFunction<typeof JWT.decode>
      mockDecode.mockImplementationOnce((token) => jwt)
      await expect(JWT.validate(token, audience, issuer)).rejects.toThrow(
        Problem,
      )
    })
    it("throws an error if the jwt is expired", async () => {
      const token = "token"
      const audience = "audience"
      const issuer = "issuer"
      const jwt = createJWT()
      jwt.payload.exp = Date.now()
      const mockDecode = JWT.decode as jest.MockedFunction<typeof JWT.decode>
      mockDecode.mockImplementationOnce((token) => jwt)
      await expect(JWT.validate(token, audience, issuer)).rejects.toThrow(
        Problem,
      )
    })
    it.skip("throws an error if no matching key is found", async () => {
      // const keyStore = JWK.createKeyStore()
      // await keyStore.generate("RSA", 2048, { alg: "RS256", use: "sig" })
      // const token = "token"
      // const audience = "audience"
      // const issuer = "issuer"
      // const jwks = keyStore.toJSON() as { keys: JWK[] }
      // const jwt = createJWT()
      // const mockDecode = decode as jest.MockedFunction<typeof decode>
      // mockDecode.mockImplementationOnce((token) => jwt)
      // const mockFetchJWKS = fetchJWKS as jest.MockedFunction<typeof fetchJWKS>
      // mockFetchJWKS.mockImplementationOnce((issuer) => Promise.resolve(jwks))
      // await expect(validateToken(token, audience, issuer)).rejects.toThrow(
      //   Problem,
      // )
      // expect(decode).toHaveBeenCalledWith(token)
    })
    // it("throws an error if the signature is invalid", async () => {
    //   const keyStore = JWK.createKeyStore()
    //   await keyStore.generate("RSA", 2048, { alg: "RS256", use: "sig" })
    //   const token = "token"
    //   const audience = "audience"
    //   const issuer = "issuer"
    //   const jwks = keyStore.toJSON() as {keys: JWK[]}
    //   const jwt = createJWT()
    //   jwt.header.kid = jwks.keys[0].kid
    //   const mockDecode = decode as jest.MockedFunction<typeof decode>
    //   mockDecode.mockImplementationOnce((token) => jwt)
    //   const mockFetchJWKS = fetchJWKS as jest.MockedFunction<typeof fetchJWKS>
    //   mockFetchJWKS.mockImplementationOnce((issuer) =>
    //     Promise.resolve(jwks),
    //   )
    //   await expect(validateToken(token, audience, issuer)).rejects.toThrow(
    //     Problem,
    //   )
    //   expect(decode).toHaveBeenCalledWith(token)
    // })
    it.skip("returns true if the token is vaild", async () => {
      // const keyStore = JWK.createKeyStore()
      // const key = await crypto.subtle.generateKey(
      //   {
      //     name: "RSASSA-PKCS1-v1_5",
      //     hash: "SHA-256",
      //     publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      //     modulusLength: 2048,
      //   } as any,
      //   true,
      //   ["sign", "verify"],
      // )
      // const jwk = await crypto.subtle.exportKey("jwk", key.publicKey)
      // const audience = "audience"
      // const issuer = "issuer"
      // const header = base64.encode(
      //   JSON.stringify({ alg: "RS256", typ: "JWT", kid: "123" }),
      // )
      // const payload = base64.encode(
      //   JSON.stringify({
      //     aud: audience,
      //     iss: issuer,
      //     exp: Date.now() + 1000,
      //   }),
      // )
      //  uint8 to string
      // console.log(`${header.replace("=", "")}.${payload.replace("=", "")}`)
      // const token = await crypto.subtle.sign(
      //   { name: "RSASSA-PKCS1-v1_5" },
      //   key.privateKey,
      //   new TextEncoder().encode(`${header}.${payload}`),
      // )
      // console.log(token)
      // const signature = new TextDecoder().decode(token)
      // console.log(signature)
      // const token = await JWS.createSign(
      //   {
      //     alg: "RS256",
      //     format: "compact",
      //     fields: {
      //       typ: "JWT",
      //       kid: key.kid,
      //     },
      //   },
      //   key,
      // )
      //   .update(
      //     JSON.stringify({
      //       aud: audience,
      //       iss: issuer,
      //       exp: Date.now() + 1000,
      //     }),
      //   )
      //   .final()
      //   .then((result) => String(result))
      // const jwks = keyStore.toJSON() as { keys: JWK[] }
      // const mockDecode = decode as jest.MockedFunction<typeof decode>
      // mockDecode.mockImplementationOnce((token) => {
      //   // TODO find better way of using unmocked implementation
      //   const [header, payload, signature] = token.split(".")
      //   return {
      //     header: JSON.parse(atob(header)),
      //     payload: JSON.parse(atob(payload)),
      //     signature: btoa(
      //       encodeURIComponent(signature).replace(
      //         /%([0-9A-F]{2})/g,
      //         (match, p1) => {
      //           return String.fromCharCode(parseInt(p1, 16))
      //         },
      //       ),
      //     ),
      //   }
      // })
      // const mockFetchJWKS = fetchJWKS as jest.MockedFunction<typeof fetchJWKS>
      // mockFetchJWKS.mockImplementationOnce((issuer) => Promise.resolve(jwks))
      // const result = await validateToken(token, audience, issuer)
      // expect(result).toBe(true)
      // expect(decode).toHaveBeenCalledWith(token)
    })
  })
})
