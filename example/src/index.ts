import Worker, { Router, Problem } from "@okkema/worker"
import { Logger } from "@okkema/worker/sentry"
import { Emailer, Email } from "@okkema/worker/sendgrid"
import { Webhook } from "@okkema/worker/stripe"
import { Pages } from "@okkema/worker/cloudflare"

declare const SENTRY_DSN: string
declare const STRIPE_WEBHOOK_SECRET: string
declare const SENDGRID_API_KEY: string
declare const CLOUDFLARE_EMAIL: string
declare const CLOUDFLARE_API_KEY: string
declare const CLOUDFLARE_ACCOUNT: string

const router = Router()

router.get("/", async () => new Response("Hello, World!"))
router.get("/error", async () => {
  throw new Problem({
    title: "Internal Server Error",
    detail: "Check sentry.io for more info.",
  })
})
router.post("/stripe", async (request) => {
  const body = await request.text()
  const header = request.headers.get("Stripe-Signature")
  await Webhook({ secret: STRIPE_WEBHOOK_SECRET }).validate(body, header)
  const email: Email = {
    to: "admin@domain.tld",
    from: "webhook@domain.tld",
    subject: "New event recieved",
    html: `<p>${body}</p>`,
  }
  await Emailer({ key: SENDGRID_API_KEY }).send(email)
  return new Response("Webhook processed successfully.")
})

Worker({
  fetch: (event) => router.handle(event.request),
  scheduled: async (event) =>
    event.waitUntil(
      Pages({
        email: CLOUDFLARE_EMAIL,
        key: CLOUDFLARE_API_KEY,
        account: CLOUDFLARE_ACCOUNT,
      }).deploy("my-pages-project"),
    ),
  logger: Logger({ DSN: SENTRY_DSN }),
})
