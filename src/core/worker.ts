import Problem from "./problem"
import { sanitize } from "../utils"

export type EventHandler = (event: FetchEvent) => Promise<Response>

export type Logger = {
  log: (event: FetchEvent, error: Error) => Promise<boolean>
}

type WorkerInit = {
  handler: EventHandler
  logger?: Logger
}

type Worker = {
  handle: EventHandler
}

const Worker = (init: WorkerInit): Worker => {
  const { handler, logger } = init

  const handle = async (event: FetchEvent) => {
    try {
      return await handler(event)
    } catch (error) {
      if (logger) await logger.log(event, error)
      if (error instanceof Problem) {
        const { detail, status, title, type } = error
        return new Response(
          JSON.stringify(sanitize({ detail, status, title, type })),
          {
            status,
            statusText: "Problem Details",
            headers: {
              "Content-Type": "application/json",
            },
          },
        )
      }
      return new Response(error.message, { status: 500 })
    }
  }

  addEventListener("fetch", (event) => {
    event.respondWith(handle(event))
  })

  return {
    handle,
  }
}

export default Worker
