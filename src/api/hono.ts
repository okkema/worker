import { fromHono, type RouterOptions } from "chanfana"
import { Hono } from "hono"
import {
  authenticate,
  error,
  type AuthBindings,
  type AuthVariables,
  type ErrorBindings,
  type ErrorVariables,
} from "./middleware"
import { type Logger } from "../core"

type APIInit = {
  tokenUrl?: string
  options?: RouterOptions
  scopes?: Record<string, string>
  logger?: Logger
}

type APIBindings = AuthBindings & ErrorBindings

type APIVariables = AuthVariables & ErrorVariables

export function API<
  Bindings extends APIBindings,
  Variables extends APIVariables,
>({ tokenUrl, options, scopes, logger }: APIInit = {}) {
  const base = new Hono<{ Bindings: Bindings; Variables: Variables }>()
  const app = fromHono(base, options)
  if (tokenUrl) {
    app.registry.registerComponent("securitySchemes", "Oauth2", {
      type: "oauth2",
      flows: {
        clientCredentials: {
          tokenUrl,
          scopes,
        },
      },
    })
    app.use("*", authenticate)
  }
  if (logger) {
    app.use("*", logger)
  }
  app.onError(error)
  return app as Hono<{ Bindings: Bindings; Variables: Variables }>
}
