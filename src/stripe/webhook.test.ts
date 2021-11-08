import { Problem } from "../core"
import Webhook from "./webhook"

describe("StripeWebhook", () => {
  it("creates and validates", async () => {
    const secret = "SUPER_SECRET_KEY"
    const body = JSON.stringify({
      some: "body",
    })
    const webhook = Webhook({ secret })
    const header = await webhook.create(body)
    expect(header).toMatch(/^t=[0-9]+(,v[0-9]+=[0-9a-f]+)+$/g)
    const result = await webhook.validate(body, header)
    expect(result).toBe(true)
  })
  it("throws a Problem on validation error", async () => {
    const secret = "SUPER_SECRET_KEY"
    const body = JSON.stringify({
      some: "body",
    })
    const webhook = Webhook({ secret })
    const header = await webhook.create(body)
    const other = JSON.stringify({
      some: "other",
    })
    await expect(webhook.validate(other, header)).rejects.toThrowError(Problem)
  })
})
