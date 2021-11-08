import { Miniflare } from "miniflare"

describe("example", () => {
  let mf: Miniflare
  beforeAll(() => {
    mf = new Miniflare()
  })
  it("returns a 200", async () => {
    const res = await mf.dispatchFetch("http://localhost:8787/")
    expect(res.status).toBe(200)
    const text = await res.text()
    expect(text).toBe("Hello, World!")
  })
  it("returns a problem", async () => {
    const res = await mf.dispatchFetch("http://localhost:8787/error")
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.title).toBe("Internal Server Error")
    expect(json.detail).toBe("Check sentry.io for more info.")
    expect(json.status).toBe(res.status)
  })
})
