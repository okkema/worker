import { Context } from "hono"
import { Problem } from "../core"

export async function error(error: Error, c: Context) {
  console.log(error)
  if (!c.env.DEBUG) return c.text("Internal Server Error", { status: 500 })
  if (error instanceof Problem) return error.response
  else
    return new Problem({ title: "Unknown Error", detail: error.message })
      .response
}
