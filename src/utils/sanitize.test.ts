import sanitize from "./sanitze"

describe("sanitize", () => {
  it("removes null and undefined values", () => {
    const result = sanitize({
      key: "value",
      null: null,
      undefined: undefined,
    })
    expect(result).toEqual({ key: "value" })
  })
  it("creates a copy of the object", () => {
    const obj = { key: "value" }
    const result = sanitize(obj)
    expect(result).not.toBe(obj)
  })
  it("removes nested values", () => {
    const result = sanitize({
      key: {
        null: null,
      },
    })
    expect(result).toEqual({ key: {} })
  })
})
