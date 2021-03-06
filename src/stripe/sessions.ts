import Stripe from "stripe"
import Api from "./api"

type Sessions = {
  lineItems: (id: string) => Promise<Stripe.ApiList<Stripe.LineItem>>
  list: () => Promise<Stripe.ApiList<Stripe.Checkout.Session>>
}

type SessionsInit = {
  secret: string
}

const Sessions = (init: SessionsInit): Sessions => {
  const { secret } = init
  const api = Api({ secret })
  const base = "https://api.stripe.com/v1/checkout/sessions"
  return {
    lineItems: (id) => api.fetch(`${base}/${id}/line_items`),
    list: () => api.fetch(`${base}`),
  }
}

export default Sessions
