import Problem from "./problem"

export type FetchEventHandler = (event: FetchEvent) => Promise<Response>

export type ScheduledEventHandler = (event: ScheduledEvent) => Promise<void>

export type Logger = {
  error: (event: FetchEvent | ScheduledEvent, error: Error) => Promise<boolean>
}

type WorkerInit = {
  fetch?: FetchEventHandler
  scheduled?: ScheduledEventHandler
  logger?: Logger
  listen?: boolean
}

type Worker = {
  fetch: FetchEventHandler
  scheduled: ScheduledEventHandler
}

const Worker = (init: WorkerInit): Worker => {
  const { fetch, scheduled, logger, listen = true } = init

  const handleFetch = async (event: FetchEvent) => {
    try {
      return fetch(event)
    } catch (error) {
      if (logger) event.waitUntil(logger.error(event, error))
      if (error instanceof Problem) return error.response
      return new Response(error.message, { status: 500 })
    }
  }

  const handleScheduled = async (event: ScheduledEvent) => {
    try {
      return scheduled(event)
    } catch (error) {
      if (logger) event.waitUntil(logger.error(event, error))
      throw error
    }
  }

  if (!fetch && !scheduled)
    throw new Problem({
      title: "Worker initialization failed",
      detail: "An event handler must be provided.",
    })

  if (listen && fetch) {
    addEventListener("fetch", (event) => {
      event.respondWith(handleFetch(event))
    })
  }

  if (listen && scheduled) {
    addEventListener("scheduled", (event) => {
      event.waitUntil(handleScheduled(event))
    })
  }

  return {
    fetch: handleFetch,
    scheduled: handleScheduled,
  }
}

export default Worker
