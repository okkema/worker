import supertest from "supertest"
import { createTestApp } from "cloudflare-worker-local"
import fs from "fs"
import path from "path"

const worker = fs.readFileSync(path.join(__dirname, "../../dist/worker.js"))

const env = {
  DSN: "http://localhost",
}

describe("/", () => {
  it("should respond with a 200", async () => {
    await supertest(createTestApp(worker, null, { env })).get("/").expect(200)
  })
  it("should respond with a 500", async () => {
    await supertest(createTestApp(worker, null, {env})).get("/error").expect(500)
  })
})
