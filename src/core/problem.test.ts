import Problem from "./problem"

describe("Problem", () => {
  it("sets the init values", () => {
    const init = {
      detail: "detail",
      status: 200,
      title: "title",
      type: "type",
    }
    const result = new Problem(init)
    expect(result.name).toBe("Problem")
    expect(result.message).toBe(init.title)
    expect(result.type).toBe(init.type)
    expect(result.title).toBe(init.title)
    expect(result.status).toBe(init.status)
    expect(result.detail).toBe(init.detail)
  })
  it("uses the default values", () => {
    const init = { title: "title", detail: "detail" }
    const result = new Problem(init)
    expect(result.type).toBeUndefined()
    expect(result.status).toBe(500)
  })
})
