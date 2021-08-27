/* eslint-disable @typescript-eslint/no-unused-vars */
import { Auth0ValidatorError, validateToken } from "./validator"
import { decode } from "./decoder"
import { fetchJWKS } from "./client"
import { JWK, JWS } from "node-jose"
import { Crypto } from "node-webcrypto-ossl"

jest.mock("./decoder", () => ({
  decode: jest.fn(),
}))

jest.mock("./client", () => ({
  fetchJWKS: jest.fn(),
}))

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

describe("validator", () => {
  it("should throw an error if the type is invalid", async () => {
    const token = "token"
    const audience = "audience"
    const issuer = "issuer"
    const jwt = createJWT()
    jwt.header.typ = "invalid"
    const mockDecode = decode as jest.MockedFunction<typeof decode>
    mockDecode.mockImplementationOnce((token) => jwt)
    await expect(validateToken(token, audience, issuer)).rejects.toThrow(
      Auth0ValidatorError,
    )
    expect(decode).toHaveBeenCalledWith(token)
  })
  it("should throw an error if the algorithm is invalid", async () => {
    const token = "token"
    const audience = "audience"
    const issuer = "issuer"
    const jwt = createJWT()
    jwt.header.alg = "invalid"
    const mockDecode = decode as jest.MockedFunction<typeof decode>
    mockDecode.mockImplementationOnce((token) => jwt)
    await expect(validateToken(token, audience, issuer)).rejects.toThrow(
      Auth0ValidatorError,
    )
    expect(decode).toHaveBeenCalledWith(token)
  })
  it("should throw an error if the key id is missing", async () => {
    const token = "token"
    const audience = "audience"
    const issuer = "issuer"
    const jwt = createJWT()
    jwt.header.kid = ""
    const mockDecode = decode as jest.MockedFunction<typeof decode>
    mockDecode.mockImplementationOnce((token) => jwt)
    await expect(validateToken(token, audience, issuer)).rejects.toThrow(
      Auth0ValidatorError,
    )
    expect(decode).toHaveBeenCalledWith(token)
  })
  it("should throw an error if the audience is invalid", async () => {
    const token = "token"
    const audience = "audience"
    const issuer = "issuer"
    const jwt = createJWT()
    jwt.payload.aud = "invalid"
    const mockDecode = decode as jest.MockedFunction<typeof decode>
    mockDecode.mockImplementationOnce((token) => jwt)
    await expect(validateToken(token, audience, issuer)).rejects.toThrow(
      Auth0ValidatorError,
    )
    expect(decode).toHaveBeenCalledWith(token)
  })
  it("should throw an error if the issuer is invalid", async () => {
    const token = "token"
    const audience = "audience"
    const issuer = "issuer"
    const jwt = createJWT()
    jwt.payload.iss = "invalid"
    const mockDecode = decode as jest.MockedFunction<typeof decode>
    mockDecode.mockImplementationOnce((token) => jwt)
    await expect(validateToken(token, audience, issuer)).rejects.toThrow(
      Auth0ValidatorError,
    )
    expect(decode).toHaveBeenCalledWith(token)
  })
  it("should throw an error if the expiration is missing", async () => {
    const token = "token"
    const audience = "audience"
    const issuer = "issuer"
    const jwt = createJWT()
    jwt.payload.exp = 0
    const mockDecode = decode as jest.MockedFunction<typeof decode>
    mockDecode.mockImplementationOnce((token) => jwt)
    await expect(validateToken(token, audience, issuer)).rejects.toThrow(
      Auth0ValidatorError,
    )
    expect(decode).toHaveBeenCalledWith(token)
  })
  it("should throw an error if the jwt is expired", async () => {
    const token = "token"
    const audience = "audience"
    const issuer = "issuer"
    const jwt = createJWT()
    jwt.payload.exp = Date.now()
    const mockDecode = decode as jest.MockedFunction<typeof decode>
    mockDecode.mockImplementationOnce((token) => jwt)
    await expect(validateToken(token, audience, issuer)).rejects.toThrow(
      Auth0ValidatorError,
    )
    expect(decode).toHaveBeenCalledWith(token)
  })
  it("should throw an error if no matching key is found", async () => {
    const keyStore = JWK.createKeyStore()
    await keyStore.generate("RSA", 2048, { alg: "RS256", use: "sig" })
    const token = "token"
    const audience = "audience"
    const issuer = "issuer"
    const jwk = keyStore.toJSON() as JWK
    const jwt = createJWT()
    const mockDecode = decode as jest.MockedFunction<typeof decode>
    mockDecode.mockImplementationOnce((token) => jwt)
    const mockFetchJWKS = fetchJWKS as jest.MockedFunction<typeof fetchJWKS>
    mockFetchJWKS.mockImplementationOnce((issuer) =>
      Promise.resolve({ keys: [jwk] }),
    )
    await expect(validateToken(token, audience, issuer)).rejects.toThrow(
      Auth0ValidatorError,
    )
    expect(decode).toHaveBeenCalledWith(token)
  })
  it("should throw an error if the signature is invalid", async () => {
    const keyStore = JWK.createKeyStore()
    await keyStore.generate("RSA", 2048, { alg: "RS256", use: "sig" })
    const token = "token"
    const audience = "audience"
    const issuer = "issuer"
    const jwk = keyStore.toJSON() as JWK
    const jwt = createJWT()
    jwt.header.kid = jwk.kid
    const mockDecode = decode as jest.MockedFunction<typeof decode>
    mockDecode.mockImplementationOnce((token) => jwt)
    const mockFetchJWKS = fetchJWKS as jest.MockedFunction<typeof fetchJWKS>
    mockFetchJWKS.mockImplementationOnce((issuer) =>
      Promise.resolve({ keys: [jwk] }),
    )
    await expect(validateToken(token, audience, issuer)).rejects.toThrow(
      Auth0ValidatorError,
    )
    expect(decode).toHaveBeenCalledWith(token)
  })
  it("should return true if the token is vaild", async () => {
    Object.assign(global, {
      crypto: new Crypto(),
    })
    const keyStore = JWK.createKeyStore()
    const key = await keyStore.generate("RSA", 2048, {
      alg: "RS256",
      use: "sig",
    })
    const audience = "audience"
    const issuer = "issuer"
    const token = await JWS.createSign(
      {
        alg: "RS256",
        format: "compact",
        fields: {
          typ: "JWT",
          kid: key.kid,
        },
      },
      key,
    )
      .update(
        JSON.stringify({
          aud: audience,
          iss: issuer,
          exp: Date.now() + 1000,
        }),
      )
      .final()
      .then((result) => String(result))
    const jwk = keyStore.toJSON() as JWK
    const mockDecode = decode as jest.MockedFunction<typeof decode>
    mockDecode.mockImplementationOnce((token) => {
      // TODO find better way of using unmocked implementation
      const [header, payload, signature] = token.split(".")
      return {
        header: JSON.parse(atob(header)),
        payload: JSON.parse(atob(payload)),
        signature: btoa(
          encodeURIComponent(signature).replace(
            /%([0-9A-F]{2})/g,
            (match, p1) => {
              return String.fromCharCode(parseInt(p1, 16))
            },
          ),
        ),
      }
    })
    const mockFetchJWKS = fetchJWKS as jest.MockedFunction<typeof fetchJWKS>
    mockFetchJWKS.mockImplementationOnce((issuer) =>
      Promise.resolve({ keys: [jwk] }),
    )
    const result = await validateToken(token, audience, issuer)
    expect(result).toBe(true)
    expect(decode).toHaveBeenCalledWith(token)
  })
})
