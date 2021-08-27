import { TextEncoder } from "util"
import { CoreError } from "../core/error"
import { fetchJWKS } from "./client"
import { decode } from "./decoder"

export class Auth0ValidatorError extends CoreError {
  constructor(message = "Auth0ValidatorError") {
    super(message)
  }
}

export const validateToken = async (
  token: string,
  audience: string,
  issuer: string,
): Promise<boolean> => {
  const jwt = decode(token)
  validateHeader(jwt)
  validatePayload(jwt, audience, issuer)
  validateSignature(jwt, token)
  return true
}

const importKey = async (jwk: JWK) => {
  return {
    kid: jwk.kid,
    key: await crypto.subtle.importKey(
      "jwk",
      jwk,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"],
    ),
  }
}

const verifySignature = (jwt: JWT, token: string, key: CryptoKey) => {
  const [header, payload] = token.split(".")
  return crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    new Uint8Array(Array.from(jwt.signature).map((x) => x.charCodeAt(0))),
    new TextEncoder().encode(`${header}.${payload}`),
  )
}

const validateSignature = async (jwt: JWT, token: string) => {
  const jwks = await fetchJWKS(jwt.payload.iss)
  const keys = await Promise.all(jwks.keys.map(importKey))
  const key = keys.find((x) => x.kid === jwt.header.kid)
  if (!key)
    throw new Auth0ValidatorError(`No matching JWK found: ${jwt.header.kid}`)
  try {
    if (!(await verifySignature(jwt, token, key.key)))
      throw new Auth0ValidatorError("Invalid JWT signature")
  } catch (error) {
    console.log(error)
  }
}

const validateExpiration = (jwt: JWT) => {
  const expiration = new Date(0)
  if (!jwt.payload?.exp) throw new Auth0ValidatorError("Missing JWT expiration")
  expiration.setUTCSeconds(jwt.payload.exp)
  const now = new Date(Date.now())
  if (expiration <= now) throw new Auth0ValidatorError("JWT is expired")
}

const validatePayload = (jwt: JWT, audience: string, issuer: string) => {
  if (jwt.payload?.aud !== audience)
    throw new Auth0ValidatorError(`Invalid JWT audience: ${jwt.payload?.aud}`)
  if (jwt.payload?.iss !== issuer)
    throw new Auth0ValidatorError(`Invalid JWT issuer: ${jwt.payload?.iss}`)
  validateExpiration(jwt)
}

const validateHeader = (jwt: JWT) => {
  if (jwt.header?.typ !== "JWT")
    throw new Auth0ValidatorError(`Invalid JWT type: ${jwt.header?.typ}`)
  if (jwt.header?.alg !== "RS256")
    throw new Auth0ValidatorError(`Invalid JWT algorithm: ${jwt.header?.alg}`)
  if (!jwt.header?.kid) throw new Auth0ValidatorError("Missing JWT key id")
}
