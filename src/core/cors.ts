type CORS = {
  origin: string
  methods?: string[]
  headers?: string[]
}

const DEFAULT: CORS = {
  origin: "*",
  methods: ["*"],
  headers: ["*"],
}

const CORS = (
  request: Request,
  response: Response,
  cors: Partial<CORS>,
): Response => {
  const { method } = request
  const { origin, methods, headers } = { ...DEFAULT, ...cors }
  const clone = new Response(response.body, response)
  clone.headers.append("Access-Control-Allow-Origin", origin)
  if (method === "OPTIONS") {
    if (methods.length)
      response.headers.append(
        "Access-Control-Allow-Methods",
        methods.join(", "),
      )
    if (headers.length)
      response.headers.append(
        "Access-Control-Allow-Headers",
        headers.join(", "),
      )
  }
  return clone
}

export default CORS
