import { InternalServerError } from "./responses"

export const Worker = (options: {
  handler: (event: FetchEvent) => Promise<Response>
  logger?: (event: FetchEvent, error: Error) => Promise<boolean>
}): { handle: (event: FetchEvent) => Promise<Response> } => {
  const { handler, logger } = options

  const handleError = async (event: FetchEvent, error: Error) => {
    if (logger) await logger(event, error)
    return InternalServerError()
  }

  const handleEvent = async (event: FetchEvent) => {
    let response
    try {
      response = await handler(event)
    } catch (error) {
      response = await handleError(event, error)
    }
    return response
  }

  addEventListener("fetch", (event) => {
    event.respondWith(handleEvent(event))
  })

  return {
    handle: handleEvent,
  }
}
