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
    // @ts-expect-error Type 'Headers' is missing the following properties from type 'Headers': getAll, entries, keys, values, [Symbol.iterator]
    async fetch(request) {
      const token = await oauth.token(url)
      const headers = { ...request.headers, Authorization: `Bearer ${token}` }
      // @ts-expect-error Property 'value' is optional in type '{ done: true; value?: undefined; }' but required in type 'ReadableStreamReadDoneResult<T>'.ts(2769)
      return fetch(url, { ...request, headers })
    },
  }
}
