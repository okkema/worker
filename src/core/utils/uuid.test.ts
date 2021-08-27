import { uuid } from "./uuid"

describe("uuid", () => {
  it("generates a uuid in correct format", () => {
    const regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    const result = uuid()
    expect(regex.test(result)).toBe(true)
  })
  it("generates unique uuids", () => {
    const test = []
    for (let i = 0; i < 10000; i++) {
      test.push(uuid())
    }
    const result = uuid()
    expect(test.includes(result)).toBe(false)
  })
})
