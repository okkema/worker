import CoreError from "./error"
import { InternalServerError, ProblemDetails } from "./responses"

type WorkerInit = {
  handler: (event: FetchEvent) => Promise<Response>
  logger?: (event: FetchEvent, error: Error) => Promise<boolean>
}

type Worker = {
  handleEvent: (event: FetchEvent) => Promise<Response>
}

const Worker = (init: WorkerInit): Worker => {
  const { handler, logger } = init

  const handleError = async (event: FetchEvent, error: Error) => {
    if (logger) await logger(event, error)
    if (error instanceof CoreError) return ProblemDetails(error)
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
    handleEvent,
  }
}

export default Worker
