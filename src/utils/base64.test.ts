import { urlSafeEncodeBase64, urlSafeDecodeBase64 } from "./base64"

describe("base64", () => {
  it("encodes utf8 to base64", () => {
    expect(urlSafeEncodeBase64("✓ à la mode")).toBe("4pyTIMOgIGxhIG1vZGU=")
  })
  it("decodes base64 to utf8", () => {
    expect(urlSafeDecodeBase64("4pyTIMOgIGxhIG1vZGU=")).toBe("✓ à la mode")
  })
})
