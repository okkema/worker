import CoreError from "./error"

describe("CoreError", () => {
  it("contains default values", () => {
    const result = new CoreError({})
    expect(result.name).toBe(CoreError.name)
    expect(result.message).toBe(CoreError.name)
    expect(result.type).toBe(CoreError.name)
    expect(result.title).toBe(CoreError.name)
    expect(result.status).toBe(500)
    expect(result.detail).toBe(CoreError.name)
  })

  it("sets the init values", () => {
    const init = {
      detail: "detail",
      status: 200,
      title: "title",
      type: "type",
    }
    const result = new CoreError(init)
    expect(result.name).toBe(CoreError.name)
    expect(result.message).toBe(init.title)
    expect(result.type).toBe(init.type)
    expect(result.title).toBe(init.title)
    expect(result.status).toBe(init.status)
    expect(result.detail).toBe(init.detail)
  })
  it("can be extended", () => {
    class TestError extends CoreError {}
    const result = new TestError()
    expect(result.name).toBe(TestError.name)
    expect(result.message).toBe(TestError.name)
    expect(result.type).toBe(TestError.name)
    expect(result.title).toBe(TestError.name)
    expect(result.status).toBe(500)
    expect(result.detail).toBe(TestError.name)
  })
})
