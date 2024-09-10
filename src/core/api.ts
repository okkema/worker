import { fromHono, type RouterOptions } from "chanfana"
import { Hono } from "hono"
import {
  authenticate,
  error,
  type AuthBindings,
  type AuthVariables,
} from "../middleware"

type APIInit = {
  tokenUrl: string
  options?: RouterOptions
  scopes?: Record<string, string>
}

type APIBindings = AuthBindings

type APIVariables = AuthVariables

export function API<
  Bindings extends APIBindings,
  Variables extends APIVariables,
>({ tokenUrl, options, scopes }: APIInit) {
  const base = new Hono<{ Bindings: Bindings; Variables: Variables }>()
  const app = fromHono(base, options)

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
  app.onError(error)
  return app as Hono<{ Bindings: Bindings; Variables: Variables }>
}
