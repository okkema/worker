import { CoreError } from "../error"

describe("error", () => {
  it("should set the message", () => {
    const message = "error"
    const error = new CoreError(message)
    expect(error.message).toBe(message)
  })
  it("should set the name", () => {
    const error = new CoreError()
    expect(error.name).toBe(error.constructor.name)
  })
})
