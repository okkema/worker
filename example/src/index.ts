import { Problem, Worker } from "@okkema/worker"
import type { Environment } from "@okkema/worker"

export default Worker({
  async fetch(request: Request, _?: Environment) {
    const url = new URL(request.url)
    if (url.pathname === "/error")
      throw new Problem({ detail: "detail", title: "title" })
    return new Response("success")
  },
})
