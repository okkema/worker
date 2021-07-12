import { CoreError } from "../core/error"

export class Auth0ClientError extends CoreError {
  constructor(message = "Auth0ClientError") {
    super(message)
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
