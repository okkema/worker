/* eslint-disable @typescript-eslint/no-unused-vars */
import { Auth0ValidatorError, validateToken } from "../validator"
import { decode } from "../decoder"
import { fetchJWKS } from "../client"

jest.mock("../decoder", () => ({
  decode: jest.fn(),
}))

jest.mock("../client", () => ({
  fetchJWKS: jest.fn(),
}))

const createJWT = () => ({
  header: {
    alg: "RSA",
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
})
