import { JsonWebToken } from "../../auth"

/**
 * Auth Middleware Bindings
 */
export type AuthBindings = {
  OAUTH_AUDIENCE: string
  OAUTH_TENANT: string
  OAUTH_SCOPE: string
  OAUTH_CLIENT_ID: string
  OAUTH_CLIENT_SECRET: string
}
/**
 * Auth Middleware Variables
 */
export type AuthVariables = {
  jwt: JsonWebToken
}
