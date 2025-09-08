import { fromHono, type RouterOptions } from "chanfana"
import { Hono } from "hono"
import {
  authenticate,
  error,
  type ErrorBindings,
  type ErrorVariables,
} from "./"
import { login, loginCallback, logout, logoutCallback } from "./auth/routes"
import { type AuthBindings, type AuthVariables } from "./auth"

type APIInit = {
  auth?: {
    tenant: string
    authorizationCode?: boolean
    clientCredentials?: boolean
    skipAuthentication?: boolean
    scopes?: Record<string, string>
  }
  options?: RouterOptions
}

type APIBindings = AuthBindings & ErrorBindings

type APIVariables = AuthVariables & ErrorVariables

export function API<
  Bindings extends APIBindings,
  Variables extends APIVariables,
>({ auth, options }: APIInit = {}) {
  const base = new Hono<{ Bindings: Bindings; Variables: Variables }>()
  const app = fromHono(base, options)
  if (auth) {
    let authTenant = auth.tenant
    if (!authTenant.startsWith("https://")) authTenant = `https://${authTenant}`
    if (auth.authorizationCode) {
      app.registry.registerComponent("securitySchemes", "Oauth2", {
        type: "oauth2",
        flows: {
          authorizationCode: {
            authorizationUrl: `${authTenant}/authorize`,
            tokenUrl: `${authTenant}/oauth/token`,
            scopes: auth.scopes,
          },
        },
      })
      app.get("/auth/login", login)
      app.get("/auth/login/callback", loginCallback)
      app.get("/auth/logout", logout)
      app.get("/auth/logout/callback", logoutCallback)
    }
    if (auth.clientCredentials) {
      app.registry.registerComponent("securitySchemes", "Oauth2", {
        type: "oauth2",
        flows: {
          clientCredentials: {
            tokenUrl: `${authTenant}/oauth/token`,
            scopes: auth.scopes,
          },
        },
      })
    }
    if (!auth.skipAuthentication) {
      app.use("*", authenticate)
    }
  }
  app.onError(error)
  return app as Hono<{ Bindings: Bindings; Variables: Variables }>
}
