import CoreError from "./error"

describe("CoreError", () => {
  it("contains default values", () => {
    const result = new CoreError()
    expect(result.name).toBe("CoreError")
    expect(result.message).toBe("CoreError")
    expect(result.type).toBe("CoreError")
    expect(result.title).toBe("CoreError")
    expect(result.status).toBe(500)
    expect(result.detail).toBe("CoreError")
  })
  it("sets the init values", () => {
    const init = {
      detail: "detail",
      status: 200,
      title: "title",
      type: "type",
    }
    const result = new CoreError(init)
    expect(result.name).toBe(init.type)
    expect(result.message).toBe(init.title)
    expect(result.type).toBe(init.type)
    expect(result.title).toBe(init.title)
    expect(result.status).toBe(init.status)
    expect(result.detail).toBe(init.detail)
  })
  it("can be extended", () => {
    const type = "TestError"
    class TestError extends CoreError {
      constructor() { super({type})}
    }
    const result = new TestError()
    expect(result.name).toBe(type)
    expect(result.message).toBe(type)
    expect(result.type).toBe(type)
    expect(result.title).toBe(type)
    expect(result.status).toBe(500)
    expect(result.detail).toBe(type)
  })
})
