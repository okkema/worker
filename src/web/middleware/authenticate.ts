import { JWT } from "@okkema/worker/auth"
import type { APIContext, MiddlewareNext } from "astro"

export async function authenticate(context: APIContext, next: MiddlewareNext) {
    const token = JWT.get(context.request)
    const jwt = JWT.decode(token)
    await JWT.validate(jwt, 
        context.locals.runtime.env.OAUTH_AUDIENCE, 
        context.locals.runtime.env.OAUTH_TENANT)
    context.locals.jwt = jwt.decoded
    return next()
}