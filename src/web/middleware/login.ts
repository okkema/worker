import type { OAuthResponse } from "../../auth"
import type { APIContext, MiddlewareNext } from "astro"

export async function login(context: APIContext, next: MiddlewareNext) {
    if(!context.request.headers.has("Authorization")) {
        const cookie = context.cookies.get("auth")
        if (!cookie) return context.redirect("/auth/login")
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