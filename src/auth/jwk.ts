import { Problem } from "../core"
import { RSA } from "../crypto"

export type JsonWebKey = {
  alg: string
  kty: string
  use: string
  n: string
  e: string
  kid: string
  x5t: string
  x5c: string[]
}

export const JWK = {
  async import(jwk: JsonWebKey): Promise<{ kid: string; key: CryptoKey }> {
    return {
      kid: jwk.kid,
      key: await RSA.import(jwk, "jwk", "verify"),
    }
  },
  async fetch(issuer: string): Promise<{ keys: JsonWebKey[] }> {
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
