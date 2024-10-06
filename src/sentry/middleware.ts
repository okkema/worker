import { Context, Next } from "hono"
import { ErrorBindings, ErrorVariables } from "../api/middleware"
import { SentryLogger } from "./logger"

export async function sentry(
  c: Context<{ Bindings: ErrorBindings; Variables: ErrorVariables }>,
  next: Next,
) {
  c.set("logger", SentryLogger)
  await next()
}
