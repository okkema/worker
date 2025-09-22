import { Context } from "hono"
import { Problem } from "../core"

/**
 * Error Middleware Bindings
 */
export type ErrorBindings = {
  DEBUG?: string
}

export async function error(
  error: Error,
  c: Context<{ Bindings: ErrorBindings }>,
) {
  console.error(error)
  if (!c.env.DEBUG) return c.text("Internal Server Error", { status: 500 })
  if (error instanceof Problem) return error.response
  else
    return new Problem({ title: "Unknown Error", detail: error.message })
      .response
}
