import { Context } from "hono"
import { type Logger, Problem } from "../core"

/**
 * Error Middleware Bindings
 */
export type ErrorBindings = {
  DEBUG?: string
}

/**
 * Error Middleware Variables
 */
export type ErrorVariables = {
  logger?: Logger
}

export async function error(
  error: Error,
  c: Context<{ Bindings: ErrorBindings; Variables: ErrorVariables }>,
) {
  if (c.var.logger) c.var.logger.error(error)
  else console.log(error)
  if (!c.env.DEBUG) return c.text("Internal Server Error", { status: 500 })
  if (error instanceof Problem) return error.response
  else
    return new Problem({ title: "Unknown Error", detail: error.message })
      .response
}
