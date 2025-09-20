import type { ExportedHandler } from "@cloudflare/workers-types"
import { withSentry, consoleLoggingIntegration } from "@sentry/cloudflare"

type SentryEnvironment = {
  SENTRY_DSN: string
}

export function SentryWorker<Environment extends SentryEnvironment>(
  handler: ExportedHandler<Environment>,
) {
  // @ts-expect-error Type 'Request<unknown, IncomingRequestCfProperties<unknown>>' is missing the following properties from type 'Request<unknown, IncomingRequestCfProperties<unknown>>': cache, credentials, destination, mode, and 2 more.
  return withSentry(function (env: Environment) {
    return {
      dsn: env.SENTRY_DSN,
      enableLogs: true,
      integrations: [consoleLoggingIntegration()],
    }
  // @ts-expect-error Type 'Headers' is missing the following properties from type 'Headers': getAll, entries, keys, values, [Symbol.iterator]
  }, handler) as ExportedHandler<Environment>
}
