import { Problem, Worker } from "@okkema/worker"
import { Response } from "@cloudflare/workers-types"

export default Worker({
  async fetch(request) {
    const url = new URL(request.url)
    if (url.pathname === "/error")
      throw new Problem({ detail: "detail", title: "title" })
    return new Response("success")
  },
})
