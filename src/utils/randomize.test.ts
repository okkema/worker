import randomize from "./randomize"

describe("randomize", () => {
  it("retuns the specified length", () => {
    expect(randomize(1).length).toBe(1)
    expect(randomize(5).length).toBe(5)
    expect(randomize(10).length).toBe(10)
  })
  it("returns random data", () => {
    const test = randomize(8)
    for (let i = 0; i < 1000; i++) {
      expect(test).not.toEqual(randomize(8))
    }
  })
})
