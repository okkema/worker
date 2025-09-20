import { Problem } from "../../core"
import type { APIContext } from "astro"

export async function logoutHandler(context: APIContext) {
    let origin = context.locals.runtime.env.OAUTH_TENANT
    if (!origin.startsWith("https://")) origin = `https://${origin}`
    const cookie = context.cookies.get("auth")
    if (!cookie) throw new Problem({ 
        title: "Auth Logout Error",
        detail: "Missing auth cookie"
    })
    const params = new URLSearchParams({
        client_id: context.locals.runtime.env.OAUTH_CLIENT_ID,
        returnTo: `${context.url.origin}/auth/logout/callback`
    })
    return context.redirect(`${origin}/v2/logout?${params}`)
}
