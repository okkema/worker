import { Context } from "hono"
import { Problem } from "../core"

export async function error(
  error: Error,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  c: Context,
) {
  console.error("Unhandled error %s", error.name)
  if (error.cause) console.error("Root cause: %s", error.cause)
  console.error(error.message)
  if (error.stack) console.error(error.stack)
  if (error instanceof Problem) return error.response
  else throw error
}
