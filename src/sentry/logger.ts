import { uuid } from "../core/utils/uuid"

export const Logger = (options: {
  DSN: string
}): { log: (event: FetchEvent, error: Error) => Promise<boolean> } => {
  const { DSN } = options
  const { origin, pathname, username } = new URL(DSN)
  const client = "spider"
  const url = `${origin}/api${pathname}/store/?sentry_key=${username}&sentry_version=7&sentry_client=${client}`

  const log = async (event: FetchEvent, error: Error) => {
    const resp = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        event_id: uuid(),
        timestamp: new Date().toISOString().substr(0, 19),
        sdk: {
          name: client,
          version: "1.0.0",
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
  }

  return {
    log,
  }
}
