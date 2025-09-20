import { Problem } from "../../core"
import type { OAuthResponse } from "../../auth"
import type { APIContext } from "astro"
import { base64url } from "rfc4648"

export async function loginCallback(context: APIContext) {
    const code = context.url.searchParams.get("code")
    if (!code) throw new Problem({
        title: "Auth Callback Error", 
        detail: "Missing code URL parameter" 
    })
    let origin = context.locals.runtime.env.OAUTH_TENANT
    if (!origin.startsWith("https://")) origin = `https://${origin}`
    const response = await fetch(`${origin}/oauth/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: context.locals.runtime.env.OAUTH_CLIENT_ID,
            client_secret: context.locals.runtime.env.OAUTH_CLIENT_SECRET,
            code,
            redirect_uri: `${context.url.origin}/auth/login/callback`
        }),
    })
    if (!response.ok) throw new Problem({ 
        title: "Auth Callback Error", 
        detail: "Failed to get token", 
        status: response.status 
    })
    const tokens = await response.json<OAuthResponse>()
    const expires = new Date()
    expires.setSeconds(new Date().getSeconds() + tokens.expires_in)
    context.cookies.set("auth", tokens, { path: "/", secure: true, expires })
    const state = context.url.searchParams.get("state")
    if (state) {
        const json = JSON.parse(new TextDecoder().decode(base64url.parse(state)))
        if (json.redirect) return context.redirect(json.redirect)
    }
    return context.redirect(context.url.origin)
}
