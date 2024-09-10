import type { ExportedHandler } from "@cloudflare/workers-types"
import { withSentry } from "@sentry/cloudflare"

type WorkerEnvironment = {
  SENTRY_DSN: string
}

export function Worker<Environment extends WorkerEnvironment>(
  handler: ExportedHandler<Environment>,
) {
  return withSentry(function (env: Environment) {
    return {
      dsn: env.SENTRY_DSN,
    }
  }, handler) as ExportedHandler<Environment>
}
