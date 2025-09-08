import { type Context } from "hono"
import { type AuthBindings, type AuthVariables } from "."
import { deleteCookie, getCookie, setCookie } from "hono/cookie"
import { type OAuthResponse } from "../../auth"
import { Problem } from "../../core"

export async function login(
  c: Context<{ Bindings: AuthBindings; Variables: AuthVariables }>,
) {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: c.env.OAUTH_CLIENT_ID,
    redirect_uri: `${new URL(c.req.url).origin}/auth/login/callback`,
    scope: `openid profile email offline_access ${c.env.OAUTH_SCOPE}`,
    audience: c.env.OAUTH_AUDIENCE,
  })
  let origin = c.env.OAUTH_TENANT
  if (!origin.startsWith("https://")) origin = `https://${origin}`
  return c.redirect(`${origin}/authorize?${params}`)
}

export async function loginCallback(
  c: Context<{ Bindings: AuthBindings; Variables: AuthVariables }>,
) {
  const url = new URL(c.req.url)
  const code = url.searchParams.get("code")
  if (!code)
    throw new Problem({
      title: "Auth Callback Error",
      detail: "Missing code URL parameter",
    })
  let origin = c.env.OAUTH_TENANT
  if (!origin.startsWith("https://")) origin = `https://${origin}`
  const response = await fetch(`${origin}/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: c.env.OAUTH_CLIENT_ID,
      client_secret: c.env.OAUTH_CLIENT_SECRET,
      code,
      redirect_uri: `${url.origin}/auth/login/callback`,
    }),
  })
  if (!response.ok)
    throw new Problem({
      title: "Auth Callback Error",
      detail: "Failed to get token",
      status: response.status,
    })
  const tokens = await response.json<OAuthResponse>()
  const expires = new Date()
  expires.setSeconds(new Date().getSeconds() + tokens.expires_in)
  setCookie(c, "auth", JSON.stringify(tokens), {
    path: "/",
    secure: true,
    expires,
  })
  return c.redirect(url.origin)
}

export async function logout(
  c: Context<{ Bindings: AuthBindings; Variables: AuthVariables }>,
) {
  let origin = c.env.OAUTH_TENANT
  if (!origin.startsWith("https://")) origin = `https://${origin}`
  const cookie = getCookie(c, "auth")
  if (!cookie)
    throw new Problem({
      title: "Auth Logout Error",
      detail: "Missing auth cookie",
    })
  const params = new URLSearchParams({
    client_id: c.env.OAUTH_CLIENT_ID,
    returnTo: `${new URL(c.req.url).origin}/auth/logout/callback`,
  })
  return c.redirect(`${origin}/v2/logout?${params}`)
}

export async function logoutCallback(
  c: Context<{ Bindings: AuthBindings; Variables: AuthVariables }>,
) {
  deleteCookie(c, "auth", { path: "/" })
  return c.redirect(new URL(c.req.url).origin)
}
