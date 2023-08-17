/* eslint-disable indent */
import { Problem } from "../core"
import { JWK } from "./jwk"
import { base64url } from "rfc4648"
import { RSA } from "../crypto"

export type JsonWebToken = {
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
  signature: Uint8Array
}

export type DecodedJsonWebToken = {
  decoded: JsonWebToken
  raw: {
    header: string
    payload: string
    signature: string
  }
}

async function validateSignature({
  decoded: {
    header,
    payload,
    signature
  },
}: DecodedJsonWebToken): Promise<void> {
  const jwks = await JWK.fetch(payload.iss)
  const keys = await Promise.all(jwks.keys.map(JWK.import))
  const key = keys.find((x) => x.kid === header.kid)
  if (!key)
    throw new Problem({
      title: "JWT Signature Validation Error",
      detail: `No matching JWK found: ${header.kid}`,
    })
  try {
    await RSA.verify(
      key.key,
      signature,
      `${header}.${payload}`,
    )
  } catch {
    throw new Problem({
      title: "JWT Signature Validation Error",
      detail: "Invalid JWT signature",
    })
  }
}

function validateExpiration(exp: number): void {
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

function validatePayload(
  {
    decoded: {
      payload: { aud, iss, exp },
    },
  }: DecodedJsonWebToken,
  audience: string,
  issuer: string,
) {
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
  validateExpiration(exp)
}

function validateHeader(jwt: DecodedJsonWebToken) {
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

export const JWT = {
  decode(token: string): DecodedJsonWebToken {
    const decoder = new TextDecoder()
    try {
      const [header, payload, signature] = token.split(".")
      return {
        decoded: {
          header: JSON.parse(
            decoder.decode(base64url.parse(header, { loose: true })),
          ),
          payload: JSON.parse(
            decoder.decode(base64url.parse(payload, { loose: true })),
          ),
          signature: base64url.parse(signature, { loose: true }),
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
  get(request: Request): string {
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
  async validate(
    jwt: DecodedJsonWebToken,
    audience: string,
    issuer: string,
  ): Promise<void> {
    validateHeader(jwt)
    validatePayload(jwt, audience, issuer)
    await validateSignature(jwt)
  },
}
