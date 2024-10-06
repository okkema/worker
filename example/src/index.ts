import { API, Problem, Worker } from "@okkema/worker/dist/"

export default Worker({
  async fetch(req, env, ctx) {
    const api = API()
    api.get("/error", function () {
      throw new Problem({ detail: "detail", title: "title" })
    })
    api.get("/health", function (c) {
      return c.text("success")
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return api.fetch(req as any, env, ctx) as any
  },
})
