import type { ExportedHandler } from "@cloudflare/workers-types"
import { withSentry, consoleLoggingIntegration } from "@sentry/cloudflare"

type SentryEnvironment = {
  SENTRY_DSN: string
}

export function SentryWorker<Environment extends SentryEnvironment>(
  handler: ExportedHandler<Environment>,
) {
  return withSentry(function (env: Environment) {
    return {
      dsn: env.SENTRY_DSN,
      _experiments: {
        enableLogs: true,
      },
      integrations: [consoleLoggingIntegration()],
    }
  }, handler) as ExportedHandler<Environment>
}
