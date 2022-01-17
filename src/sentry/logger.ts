import type { Logger } from "../core"
import { uuid, sanitize } from "../utils"

declare const PACKAGE_NAME: string
declare const PACKAGE_VERSION: string

type SentryLoggerInit = {
  DSN: string
  environment?: string
}

const SentryLogger = ({
  DSN,
  environment = "production",
}: SentryLoggerInit): Logger => {
  const { origin, pathname, username } = new URL(DSN)
  const url = `${origin}/api${pathname}/store/?sentry_key=${username}&sentry_version=7&sentry_client=${PACKAGE_VERSION}`

  return {
    error: async (event, error) => {
      try {
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify(
            sanitize({
              event_id: uuid(),
              timestamp: new Date().toISOString().substr(0, 19),
              platform: "javascript",
              sdk: {
                name: PACKAGE_NAME,
                version: PACKAGE_VERSION,
              },
              level: "error",
              transaction:
                (event as FetchEvent).request?.url ??
                (event as ScheduledEvent).scheduledTime,
              server_name: "cloudflare",
              environment,
              exception: [
                {
                  type: error.name,
                  value: error.message,
                },
              ],
              request: {
                url: (event as FetchEvent).request?.url,
                method: (event as FetchEvent).request?.method,
              },
            }),
          ),
        })
        return response.ok
      } catch (error) {
        return false
      }
    },
  }
}

export default SentryLogger
