import { Problem } from "@okkema/worker"

type Environment = {
  BUCKET: R2Bucket
}

export default {
  async fetch(request: Request, _: Environment) {
    const url = new URL(request.url)
    if (url.pathname === "/error")
      throw new Problem({ detail: "detail", title: "title" })
    return new Response("success")
  },
}
