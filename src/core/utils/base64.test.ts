import { decode, encode } from "./base64"

describe("base64", () => {
  it("encodes utf8 to base64", () => {
    expect(encode("✓ à la mode")).toBe("4pyTIMOgIGxhIG1vZGU=")
  })
  it("decodes base64 to utf8", () => {
    expect(decode("4pyTIMOgIGxhIG1vZGU=")).toBe("✓ à la mode")
  })
})
