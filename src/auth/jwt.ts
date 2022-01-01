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
    aud: string[]
    exp: number
  }
  signature: string
}

type DecodedJWT = {
  decoded: JWT
  raw: {
    header: string
    payload: string
    signature: string
  }
}

const verifySignature = (jwt: DecodedJWT, key: CryptoKey) => {
  const {
    decoded: { signature },
    raw: { header, payload },
  } = jwt
  return crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    new Uint8Array(Array.from(signature).map((x) => x.charCodeAt(0))),
    new TextEncoder().encode(`${header}.${payload}`),
  )
}

const validateSignature = async (jwt: DecodedJWT) => {
  const {
    decoded: {
      header: { kid },
      payload: { iss },
    },
  } = jwt
  const jwks = await JWK.fetch(iss)
  const keys = await Promise.all(jwks.keys.map(JWK.import))
  const key = keys.find((x) => x.kid === kid)
  if (!key)
    throw new Problem({
      title: "JWT Signature Validation Error",
      detail: `No matching JWK found: ${kid}`,
    })
  if (!(await verifySignature(jwt, key.key)))
    throw new Problem({
      title: "JWT Signature Validation Error",
      detail: "Invalid JWT signature",
    })
}

const validateExpiration = (jwt: DecodedJWT) => {
  const {
    decoded: {
      payload: { exp },
    },
  } = jwt
  const expiration = new Date(0)
  if (!exp)
    throw new Problem({
      title: "JWT Expiration Validation Error",
      detail: "Missing JWT expiration",
    })
  expiration.setUTCSeconds(exp)
  const now = new Date(Date.now())
  if (expiration <= now)
    throw new Problem({
      title: "JWT Expiration Validation Error",
      detail: "JWT is expired",
    })
}

const validatePayload = (jwt: DecodedJWT, audience: string, issuer: string) => {
  const {
    decoded: {
      payload: { aud, iss },
    },
  } = jwt
  if (!aud.includes(audience))
    throw new Problem({
      title: "JWT Payload Validation Error",
      detail: `Invalid JWT audience: ${aud.join(",")}`,
    })
  if (iss !== issuer)
    throw new Problem({
      title: "JWT Payload Validation Error",
      detail: `Invalid JWT issuer: ${iss}`,
    })
  validateExpiration(jwt)
}

const validateHeader = (jwt: DecodedJWT) => {
  const {
    decoded: {
      header: { typ, alg, kid },
    },
  } = jwt
  if (typ !== "JWT")
    throw new Problem({
      title: "JWT Header Validation Error",
      detail: `Invalid JWT type: ${typ}`,
    })
  if (alg !== "RS256")
    throw new Problem({
      title: "JWT Header Validation Error",
      detail: `Invalid JWT algorithm: ${alg}`,
    })
  if (!kid)
    throw new Problem({
      title: "JWT Header Validation Error",
      detail: "Missing JWT key id",
    })
}

export default {
  decode: (token: string): DecodedJWT => {
    try {
      const [header, payload, signature] = token.split(".")
      return {
        decoded: {
          header: JSON.parse(atob(header)),
          payload: JSON.parse(atob(payload)),
          signature: base64.encode(signature),
        },
        raw: {
          header,
          payload,
          signature,
        },
      }
    } catch (error) {
      throw new Problem({
        title: "JWT Decode Error",
        detail: `Unable to decode JWT: ${error}`,
      })
    }
  },
  get: (request: Request): string => {
    const header = request.headers.get("Authorization")
    if (!header)
      throw new Problem({
        title: "JWT Error",
        detail: "Missing 'Authorization' header.",
        status: 401,
      })
    let type, token
    try {
      ;[type, token] = header.split(" ")
    } catch {
      throw new Problem({
        title: "JWT Error",
        detail: "Unable to parse 'Authorization' header.",
        status: 401,
      })
    }
    if (type !== "Bearer")
      throw new Problem({
        title: "JWT Error",
        detail: "Expected 'Bearer' token.",
        status: 401,
      })
    return token
  },
  validate: async (
    jwt: DecodedJWT,
    audience: string,
    issuer: string,
  ): Promise<void> => {
    validateHeader(jwt)
    validatePayload(jwt, audience, issuer)
    await validateSignature(jwt)
  },
}
