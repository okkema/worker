import supertest from "supertest"
import { createTestApp } from "cloudflare-worker-local"
import fs from "fs"
import path from "path"

const worker = fs.readFileSync(path.join(__dirname, "../../dist/worker.js"))

describe("/", () => {
  it("should respond to a fetch event", async () => {
    await supertest(createTestApp(worker, null)).get("/").expect(200)
  })
})
