import type {
  ExecutionContext,
  ForwardableEmailMessage,
  ScheduledEvent,
} from "@cloudflare/workers-types"
import { Problem } from "./problem"

/**
 * @typedef {Function} FetchEventHandler
 * @param {Request} request - HTTP request
 * @param {Environment} environment - Cloudflare Worker environment
 * @param {ExecutionContext} context - Cloudflare Worker execution context
 * @returns {(Response|Promise<Response>)}
 */
export type FetchEventHandler<Environment> = (
  request: Request,
  environment: Environment,
  context: ExecutionContext,
) => Response | Promise<Response>

/**
 * @typedef {Function} ScheduledEventHandler
 * @param {ScheduledEvent} event - Scheduled event
 * @param {Environment} environment - Cloudflare Worker environment
 * @param {ExecutionContext} context - Cloudflare Worker execution context
 * @returns {(void|Promise<void>)}
 */
export type ScheduledEventHandler<Environment> = (
  event: ScheduledEvent,
  environment: Environment,
  context: ExecutionContext,
) => void | Promise<void>

/**
 * @typedef {Function} EmailEventHandler
 * @param {ForwardableEmailMessage} message - Email message
 * @param {Environment} environment - Cloudflare Worker environment
 * @param {ExecutionContext} context - Cloudflare Worker execution context
 * @returns {(void|Promise<void>)}
 */
export type EmailEventHandler<Environment> = (
  message: ForwardableEmailMessage,
  environment: Environment,
  context: ExecutionContext,
) => void | Promise<void>

/**
 * @typedef {Function} ErrorHandler
 * @param {(Request|ScheduledEvent|ForwardableEmailMessage)} event - HTTP request, scheduled event or email message depending on handler
 * @param {Error} error - Javascript error
 * @param {Environment} [environment] - Cloudflare Worker environment
 * @returns {Promise<boolean>} - Indicates whether the error was handled
 */
export type ErrorHandler<Environment> = (
  event: Request | ScheduledEvent | ForwardableEmailMessage,
  error: Error,
  environment?: Environment,
) => Promise<boolean>

/**
 * @typedef {Object} Logger
 * @property {ErrorHandler} error
 */
export type Logger<Environment> = {
  error: ErrorHandler<Environment>
}

/**
 * @typedef {object} WorkerInit
 * @property {FetchEventHandler} [fetch] - Fetch event handler
 * @property {ScheduledEventHandler} [scheduled] - Scheduled event handler
 * @property {EmailEventHandler} [email] - Email event handler
 * @property {Function} [logger]
 */
type WorkerInit<Environment> = {
  fetch?: FetchEventHandler<Environment>
  scheduled?: ScheduledEventHandler<Environment>
  email?: EmailEventHandler<Environment>
  logger?: (
    environment: Environment,
    context: ExecutionContext,
  ) => Logger<Environment>
}

/**
 * @typedef {object} Worker
 * @property {FetchEventHandler} [fetch] - Fetch event handler
 * @property {ScheduledEventHandler} [scheduled] - Scheduled event handler
 * @property {EmailEventHandler} [email] - Email event handler
 */
type Worker<Environment> = {
  fetch?: FetchEventHandler<Environment>
  scheduled?: ScheduledEventHandler<Environment>
  email?: EmailEventHandler<Environment>
}

export function Worker<Environment = object>(
  init: WorkerInit<Environment>,
): Worker<Environment> {
  return {
    async fetch(request, environment, context) {
      let response: Response
      try {
        response = await init.fetch(request, environment, context)
      } catch (error) {
        if (init.logger)
          context.waitUntil(
            init
              .logger(environment, context)
              .error(request, error, environment),
          )
        if (error instanceof Problem) response = error.response
        else response = new Response(error.message, { status: 500 })
      }
      return response
    },
    async scheduled(event, environment, context) {
      try {
        await init.scheduled(event, environment, context)
      } catch (error) {
        if (init.logger)
          context.waitUntil(
            init.logger(environment, context).error(event, error, environment),
          )
        throw error
      }
    },
    async email(message, environment, context) {
      try {
        await init.email(message, environment, context)
      } catch (error) {
        if (init.logger)
          context.waitUntil(
            init
              .logger(environment, context)
              .error(message, error, environment),
          )
      }
    },
  }
}
