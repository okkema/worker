import Problem from "./problem"
import { InternalServerError, ProblemDetails } from "./responses"

type EventHandler = (event: FetchEvent) => Promise<Response>

type WorkerInit = {
  handler: EventHandler
  logger?: Logger
}

type Worker = {
  handleEvent: EventHandler
}

export type Logger = {
  logError: (event: FetchEvent, error: Error) => Promise<boolean>
}

const Worker = (init: WorkerInit): Worker => {
  const { handler, logger } = init

  const handleError = async (event: FetchEvent, error: Error) => {
    if (logger) await logger.logError(event, error)
    if (error instanceof Problem) return ProblemDetails(error)
    return InternalServerError(error.message)
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
