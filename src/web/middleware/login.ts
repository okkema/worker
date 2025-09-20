import type { OAuthResponse } from "../../auth"
import type { APIContext, MiddlewareNext } from "astro"
import { base64url } from "rfc4648"

export async function login(context: APIContext, next: MiddlewareNext) {
    if(!context.request.headers.has("Authorization")) {
        const cookie = context.cookies.get("auth")
        if (!cookie) {
            const state = new TextEncoder().encode(JSON.stringify({ redirect: context.url }))
            const params = new URLSearchParams({
                state: base64url.stringify(state),
            })
            return context.redirect(`/auth/login?${params}`)
        }
        const json: OAuthResponse = cookie.json()
        return next(new Request(context.request, {
            headers: {
                // @ts-expect-error Property '[Symbol.iterator]' is missing in type 'Headers' but required in type 'Iterable<readonly any[]>'.
                ...Object.fromEntries(context.request.headers),
                "Authorization": `${json.token_type} ${json.access_token}`,
            }
        }))
    }
    return next()
}