import type { Context, Next } from "hono"
import { type JsonWebToken, JWT } from "../../auth"
import { Problem } from "../../core"
/**
 * Auth Middleware Bindings
 */
export type AuthBindings = {
  OAUTH_AUDIENCE: string
  OAUTH_TENANT: string
}
/**
 * Auth Middleware Variables
 */
export type AuthVariables = {
  jwt: JsonWebToken
}

export async function authenticate(
  c: Context<{ Bindings: AuthBindings; Variables: AuthVariables }>,
  next: Next,
) {
  const token = JWT.get(c.req.raw)
  const decoded = JWT.decode(token)
  await JWT.validate(decoded, c.env.OAUTH_AUDIENCE, c.env.OAUTH_TENANT)
  c.set("jwt", decoded.decoded)
  await next()
}

export function authorize(...scopes: string[]) {
  return async function (
    c: Context<{ Bindings: AuthBindings; Variables: AuthVariables }>,
    next: Next,
  ) {
    const raw = c.get("jwt").payload.scope
    if (!raw)
      throw new Problem({
        detail: "JWT scope is empty",
        title: "Scope Middleware Error",
        status: 403,
      })
    const parts = raw.split(" ")
    for (const scope of scopes) {
      if (!parts.includes(scope))
        throw new Problem({
          detail: `JWT is missing required scope: ${scope}`,
          title: "Scope Middleware Error",
          status: 403,
        })
    }
    await next()
  }
}
