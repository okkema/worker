import { Miniflare } from "miniflare"

const HOST = "http://localhost:8787"
let worker: Miniflare

describe("/", () => {
  beforeAll(() => {
    worker = new Miniflare({
      scriptPath: "dist/worker.js",
    })
  })

  it("should respond with a 200", async () => {
    const result = await worker.dispatchFetch(`${HOST}/`)
    expect(result.status).toBe(200)
  })
  it("should respond with a 500", async () => {
    const result = await worker.dispatchFetch(`${HOST}/error`)
    expect(result.status).toBe(500)
  })
})
