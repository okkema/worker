import metadata from "../../package.json"
import { uuid } from "../core/utils/uuid"

type SentryLoggerInit = {
  DSN: string
}

type SentryLogger = Logger

const SentryLogger = (init: SentryLoggerInit): SentryLogger => {
  const { DSN } = init
  const { origin, pathname, username } = new URL(DSN)
  const { name, version } = metadata
  const url = `${origin}/api${pathname}/store/?sentry_key=${username}&sentry_version=7&sentry_client=${name}`

  const logError = async (event: FetchEvent, error: Error) => {
    try {
      const resp = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          event_id: uuid(),
          timestamp: new Date().toISOString().substr(0, 19),
          sdk: {
            name,
            version,
          },
          level: "error",
          transaction: event.request.url,
          server_name: "cloudflare",
          exception: {
            values: [
              {
                type: error.name,
                value: error.message,
              },
            ],
          },
          request: {
            url: event.request.url,
            method: event.request.method,
          },
        }),
      })
      return resp.ok
    } catch (error) {
      return false
    }
  }

  return {
    logError,
  }
}

export default SentryLogger
