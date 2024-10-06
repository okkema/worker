import type { ExportedHandler } from "@cloudflare/workers-types"
import { withSentry } from "@sentry/cloudflare"

type SentryEnvironment = {
  SENTRY_DSN: string
}

export function SentryWorker<Environment extends SentryEnvironment>(
  handler: ExportedHandler<Environment>,
) {
  return withSentry(function (env: Environment) {
    return {
      dsn: env.SENTRY_DSN,
    }
  }, handler) as ExportedHandler<Environment>
}
