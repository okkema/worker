import { Problem } from "../../core"
import type { APIContext, MiddlewareNext } from "astro"

export function authorize(...scopes: string[]) {
    return async function (context: APIContext, next: MiddlewareNext) {
        const raw = context.locals.jwt?.payload?.scope
        if (!raw)
            throw new Problem({
              detail: "JWT scope is empty",
              title: "Authorization Error",
              status: 403,
            })
        const parts = raw.split(" ")
        for (const scope of scopes) {
            if (!parts.includes(scope))
            throw new Problem({
                detail: `JWT is missing required scope: ${scope}`,
                title: "Authorization Error",
                status: 403,
            })
        }
        return next()
    }
}