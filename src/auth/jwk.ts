import { Problem } from "../core"

export type JWK = {
  alg: string
  kty: string
  use: string
  n: string
  e: string
  kid: string
  x5t: string
  x5c: string[]
}

export default {
  import: async (jwk: JWK): Promise<{ kid: string; key: CryptoKey }> => ({
    kid: jwk.kid,
    key: await crypto.subtle.importKey(
      "jwk",
      jwk,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"],
    ),
  }),
  fetch: async (issuer: string): Promise<{ keys: JWK[] }> => {
    const url = new URL(issuer)
    if (!url.pathname.endsWith("/")) url.pathname += "/"
    url.pathname += ".well-known/jwks.json"
    const resp = await fetch(url.href)
    if (!resp.ok)
      throw new Problem({
        title: "JWK Error",
        detail: `Error fetching JWKS: ${resp.status}`,
      })
    return resp.json()
  },
}
