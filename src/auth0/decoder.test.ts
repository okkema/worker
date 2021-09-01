import { Auth0DecoderError, decode } from "./decoder"

describe("decoder", () => {
  it("decodes a valid token", () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    const result = decode(token)
    expect(result).toBeDefined()
    expect(result).toMatchSnapshot()
  })
  it("throws an error when token is invalid", () => {
    const token = "some.bad.token"
    expect(() => decode(token)).toThrow(Auth0DecoderError)
  })
})
