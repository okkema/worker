import { Problem } from "../core"

type CloudflareApi = {
  fetch: <T>(
    url: string,
    method?: "GET" | "POST" | "PUT" | "DELETE",
    body?: Record<string, unknown>,
  ) => Promise<T>
}

type CloudflareApiInit = {
  email: string
  key: string
}

const CloudflareApi = (init: CloudflareApiInit): CloudflareApi => {
  const { email, key } = init
  return {
    fetch: async <T>(url, method = "GET", body = null) => {
      const resp = await fetch(url, {
        method,
        headers: {
          "X-Auth-Email": email,
          "X-Auth-Key": key,
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : null,
      })
      const data = await resp.json()
      if (!resp.ok)
        throw new Problem({
          title: "Cloudflare Api Error",
          detail: `Error fetching data from Cloudflare: ${JSON.stringify(
            data,
          )}`,
        })
      return data as T
    },
  }
}

export default CloudflareApi
