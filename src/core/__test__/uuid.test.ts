import { uuid } from "../uuid"
import crypto from "crypto"

declare const global: unknown

describe("uuid", () => {
  beforeEach(() => {
    Object.assign(global, {
      crypto: { getRandomValues: crypto.randomFillSync },
    })
  })
  it("should generate a uuid in correct format", () => {
    const regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    const result = uuid()
    expect(regex.test(result)).toBe(true)
  })
  it("should not generate the same uuid twice", () => {
    const result1 = uuid()
    const result2 = uuid()
    expect(result1).not.toEqual(result2)
  })
})
