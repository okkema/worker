import base64 from "./base64"

describe("base64", () => {
  it("encodes utf8 to base64", () => {
    expect(base64.encode("✓ à la mode")).toBe("4pyTIMOgIGxhIG1vZGU=")
  })
  it("decodes base64 to utf8", () => {
    expect(base64.decode("4pyTIMOgIGxhIG1vZGU=")).toBe("✓ à la mode")
  })
})
