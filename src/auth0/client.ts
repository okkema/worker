import { Problem } from "../core"

export class Auth0ClientError extends Problem {
  constructor(detail: string) {
    super({
      detail,
      status: 500,
      title: "An error occured while requesting the Auth0 API",
      type: "Auth0ClientError",
    })
  }
}

export const fetchJWKS = async (issuer: string): Promise<{ keys: JWK[] }> => {
  const url = new URL(issuer)
  if (!url.pathname.endsWith("/")) url.pathname += "/"
  url.pathname += "./well-known/jwks.json"
  const resp = await fetch(url.href)
  if (!resp.ok)
    throw new Auth0ClientError(`Error fetching JWKS: ${resp.status}`)
  return resp.json()
}
