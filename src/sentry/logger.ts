import type { Logger } from "../core"
import { sanitize } from "../utils"

const PACKAGE_NAME = "@okkema/worker"
const PACKAGE_VERSION = "development"

type SentryLoggerInit = {
  DSN: string
  environment?: string
}

export function SentryLogger<Environment>({
  DSN,
  environment = "production",
}: SentryLoggerInit): Logger<Environment> {
  const { origin, pathname, username } = new URL(DSN)
  const url = `${origin}/api${pathname}/store/?sentry_key=${username}&sentry_version=7&sentry_client=${PACKAGE_VERSION}`

  return {
    async error(event, error) {
      try {
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify(
            sanitize({
              event_id: crypto.randomUUID(),
              timestamp: new Date().toISOString().substr(0, 19),
              platform: "javascript",
              sdk: {
                name: PACKAGE_NAME,
                version: PACKAGE_VERSION,
              },
              level: "error",
              transaction:
                (event as Request)?.url ??
                (event as ScheduledEvent).scheduledTime,
              server_name: "cloudflare",
              environment,
              exception: {
                values: [
                  {
                    type: error.name,
                    value: error.message,
                  },
                ],
              },
              request: {
                url: (event as Request)?.url,
                method: (event as Request)?.method,
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
