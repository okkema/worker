import type {
  KVNamespace,
  RequestInit,
  Response,
} from "@cloudflare/workers-types"
import { Oauth } from "./oauth"
type GoogleFunction = {
  fetch: (request: RequestInit) => Promise<Response>
}
export function GoogleFunction(
  credentials: string,
  url: string,
  kv?: KVNamespace,
): GoogleFunction {
  const oauth = Oauth(credentials, kv)
  return {
    async fetch(request) {
      const token = await oauth.token(url)
      const headers = { ...request.headers, Authorization: `Bearer ${token}` }
      return fetch(url, { ...request, headers })
    },
  }
}
