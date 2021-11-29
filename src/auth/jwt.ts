import { base64 } from "../utils"
import { Problem } from "../core"
import JWK from "./jwk"

type JWT = {
  header: {
    alg: string
    typ: string
    kid: string
  }
  payload: {
    iss: string
    sub: string
    aud: string
    exp: number
  }
  signature: string
}

const decode = (token: string): JWT => {
  try {
    const [header, payload, signature] = token.split(".")
    return {
      header: JSON.parse(atob(header)),
      payload: JSON.parse(atob(payload)),
      signature: base64.encode(signature),
    }
  } catch (error) {
    throw new Problem({
      title: "JWT Decode Error",
      detail: `Unable to decode JWT: ${error}`,
    })
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
  const jwks = await JWK.fetch(jwt.payload.iss)
  const keys = await Promise.all(jwks.keys.map(JWK.import))
  const key = keys.find((x) => x.kid === jwt.header.kid)
  if (!key)
    throw new Problem({
      title: "JWT Signature Validation Error",
      detail: `No matching JWK found: ${jwt.header.kid}`,
    })
  try {
    if (!(await verifySignature(jwt, token, key.key)))
      throw new Problem({
        title: "JWT Signature Validation Error",
        detail: "Invalid JWT signature",
      })
  } catch (error) {
    console.log(error)
  }
}

const validateExpiration = (jwt: JWT) => {
  const expiration = new Date(0)
  if (!jwt.payload?.exp)
    throw new Problem({
      title: "JWT Expiration Validation Error",
      detail: "Missing JWT expiration",
    })
  expiration.setUTCSeconds(jwt.payload.exp)
  const now = new Date(Date.now())
  if (expiration <= now)
    throw new Problem({
      title: "JWT Expiration Validation Error",
      detail: "JWT is expired",
    })
}

const validatePayload = (jwt: JWT, audience: string, issuer: string) => {
  if (jwt.payload?.aud !== audience)
    throw new Problem({
      title: "JWT Payload Validation Error",
      detail: `Invalid JWT audience: ${jwt.payload?.aud}`,
    })
  if (jwt.payload?.iss !== issuer)
    throw new Problem({
      title: "JWT Payload Validation Error",
      detail: `Invalid JWT issuer: ${jwt.payload?.iss}`,
    })
  validateExpiration(jwt)
}

const validateHeader = (jwt: JWT) => {
  if (jwt.header?.typ !== "JWT")
    throw new Problem({
      title: "JWT Header Validation Error",
      detail: `Invalid JWT type: ${jwt.header?.typ}`,
    })
  if (jwt.header?.alg !== "RS256")
    throw new Problem({
      title: "JWT Header Validation Error",
      detail: `Invalid JWT algorithm: ${jwt.header?.alg}`,
    })
  if (!jwt.header?.kid)
    throw new Problem({
      title: "JWT Header Validation Error",
      detail: "Missing JWT key id",
    })
}

export default {
  decode,
  get: (request: Request): string => {
    const [type, token] = request.headers.get("Authorization")?.split(" ")
    if (type !== "Bearer")
      throw new Problem({
        title: "JWT Error",
        detail: "Expected 'Bearer' token",
        status: 401,
      })
    return token
  },
  validate: async (
    token: string,
    audience: string,
    issuer: string,
  ): Promise<void> => {
    const jwt = decode(token)
    validateHeader(jwt)
    validatePayload(jwt, audience, issuer)
    await validateSignature(jwt, token)
  },
}
