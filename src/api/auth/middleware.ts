import { type Context, type Next } from "hono"
import { getCookie } from "hono/cookie"
import { base64url } from "rfc4648"
import { JWT, OAuthResponse } from "../../auth"
import { Problem } from "../../core"
import { AuthBindings, AuthVariables } from "."

export async function login(
  c: Context<{ Bindings: AuthBindings; Variables: AuthVariables }>,
  next: Next,
) {
  if (!c.req.header("Authorization")) {
    const cookie = getCookie(c, "auth")
    if (!cookie) {
      const state = new TextEncoder().encode(
        JSON.stringify({ redirect: c.req.url }),
      )
      const params = new URLSearchParams({
        state: base64url.stringify(state),
      })
      return c.redirect(`/auth/login?${params}`)
    }
    const json: OAuthResponse = JSON.parse(cookie)
    const request = new Request(c.req.raw)
    request.headers.set(
      "Authorization",
      `${json.token_type} ${json.access_token}`,
    )
    c.req.raw = request
  }
  await next()
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
