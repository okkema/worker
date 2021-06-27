import { InternalServerError } from "./responses"

export const Worker = (options: {
  handler: (request: Request) => Promise<Response>
  logger?: (error: Error) => void
}): { handle: (event: FetchEvent) => void } => {
  const { handler, logger } = options

  const handleError = async (error: Error) => {
    if (logger) logger(error)
    return InternalServerError()
  }

  const handleEvent = async (event: FetchEvent) => {
    let response
    try {
      response = await handler(event.request)
    } catch (error) {
      response = await handleError(error)
    }
    event.respondWith(response)
  }

  addEventListener("fetch", handleEvent)

  return {
    handle: handleEvent,
  }
}
