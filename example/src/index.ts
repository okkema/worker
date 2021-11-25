import Worker, { Router, Problem } from "@okkema/worker"
import { Logger } from "@okkema/worker/sentry"

declare const SENTRY_DSN: string

const router = Router()

router.get("/", async () => new Response("Hello, World!"))
router.get("/error", async () => {
  throw new Problem({
    title: "Internal Server Error",
    detail: "Check sentry.io for more info.",
  })
})

Worker({
  fetch: (event) => router.handle(event.request),
  logger: Logger({ DSN: SENTRY_DSN }),
})
