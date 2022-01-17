import { Problem } from "../core"
import { sanitize } from "../utils"

type StripeApi = {
  fetch: <T>(
    url: string,
    method?: "GET" | "POST" | "PUT" | "DELETE",
    body?: unknown,
  ) => Promise<T>
}

type StripeApiInit = {
  secret: string
}

const StripeApi = (init: StripeApiInit): StripeApi => {
  const { secret } = init
  return {
    fetch: async <T>(url, method = "GET", body = null) => {
      const resp = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${secret}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body
          ? new URLSearchParams(sanitize(body) as Record<string, string>)
          : null,
      })
      const data = await resp.json()
      if (!resp.ok)
        throw new Problem({
          title: "Stripe Api Error",
          detail: `Error fetching data from Stripe: ${JSON.stringify(data)}`,
        })
      return data as T
    },
  }
}

export default StripeApi
