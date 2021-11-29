import { Problem } from "../core"

export const fetchJWKS = async (issuer: string): Promise<{ keys: JWK[] }> => {
  const url = new URL(issuer)
  if (!url.pathname.endsWith("/")) url.pathname += "/"
  url.pathname += "./well-known/jwks.json"
  const resp = await fetch(url.href)
  if (!resp.ok)
    throw new Problem({
      title: "JWT Client Error",
      detail: `Error fetching JWKS: ${resp.status}`,
    })
  return resp.json()
}
