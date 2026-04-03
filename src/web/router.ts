import type { APIContext, MiddlewareNext, MiddlewareHandler } from "astro"
import { sequence } from "astro:middleware"

const NORMALIZE = /\/+(\/|$)/g // strip double & trailing slash

export function router(routes: Record<string, MiddlewareHandler>) {
    const entries = Object.entries(routes)
    return function (context: APIContext, next: MiddlewareNext) {
        return sequence(
            ...entries.filter(function ([path]) {
                return context.url.pathname.replace(NORMALIZE, '$1')
                    .match(RegExp(`^${(path
                        .replace(NORMALIZE, '$1'))
                        .replace(/(\/?)\*/g, '($1.*)?') // wildcard
                        }/*$`))
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            }).map(([_, handler]) => handler)
        )(context, next)
    }
}