import Problem from "./problem"
import CORS from "./cors"

/**
 * @typedef {Function} FetchEventHandler
 * @param {FetchEvent} event
 * @returns {Promise<Response>}
 */
export type FetchEventHandler = (event: FetchEvent) => Promise<Response>

/**
 * @typedef {Function} ScheduledEventHandler
 * @param {ScheduledEvent} event
 * @returns {Promise<void>}
 */
export type ScheduledEventHandler = (event: ScheduledEvent) => Promise<void>

/**
 * @typedef {object} Logger
 * @property {Function} error
 * @param {FetchEvent|ScheduledEvent} event
 * @param {Error} error
 * @returns {Promise<boolean>} Value indicates success.
 */
export type Logger = {
  error: (event: FetchEvent | ScheduledEvent, error: Error) => Promise<boolean>
}

/**
 * @typedef {object} WorkerInit
 * @property {FetchEventHandler} fetch
 * @property {ScheduledEventHandler} scheduled
 * @property {Logger} [logger]
 * @property {boolean} [listen] Indicates whether to add event listeners automatically.
 */
type WorkerInit = {
  fetch?: FetchEventHandler
  scheduled?: ScheduledEventHandler
  logger?: Logger
  listen?: boolean
  cors?: true | CORS
}

/**
 * @typedef {object} Worker
 * @property {FetchEventHandler} fetch
 * @property {ScheduledEventHandler} scheduled
 */
type Worker = {
  fetch: FetchEventHandler
  scheduled: ScheduledEventHandler
}

const Worker = ({
  fetch,
  scheduled,
  logger,
  listen = true,
  cors,
}: WorkerInit): Worker => {
  const handleFetch = async (event: FetchEvent) => {
    const { request } = event
    let response: Response
    try {
      response = await fetch(event)
    } catch (error) {
      if (logger) event.waitUntil(logger.error(event, error))
      if (error instanceof Problem) response = error.response
      else response = new Response(error.message, { status: 500 })
    }
    if (cors)
      response = CORS(request, response, typeof cors === "boolean" ? {} : cors)
    return response
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
