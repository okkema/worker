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
    aud: string[] | string
    exp: number
    scope?: string
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

export type ValidateOptions = {
  jwkUrl?: string
  skipAppendIssuer?: boolean
  skipPrependAudience?: boolean
  ignoreHeaderType?: boolean
}

async function validateSignature(
  { decoded: { header, payload, signature } }: DecodedJsonWebToken,
  options?: ValidateOptions,
): Promise<void> {
  const url = options?.jwkUrl ?? JWK.url(payload.iss)
  const jwks = await JWK.fetch(url)
  const keys = await Promise.all(jwks.keys.map(JWK.import))
  const key = keys.find((x) => x.kid === header.kid)
  if (!key)
    throw new Problem({
      title: "JWT Signature Validation Error",
      detail: `No matching JWK found: ${header.kid}`,
      status: 401,
    })
  try {
    await RSA.verify(key.key, signature, `${header}.${payload}`)
  } catch {
    throw new Problem({
      title: "JWT Signature Validation Error",
      detail: "Invalid JWT signature",
      status: 401,
    })
  }
}

function validateExpiration(exp: number): void {
  const expiration = new Date(0)
  if (!exp)
    throw new Problem({
      title: "JWT Expiration Validation Error",
      detail: "Missing JWT expiration",
      status: 401,
    })
  expiration.setUTCSeconds(exp)
  const now = new Date(Date.now())
  if (expiration <= now)
    throw new Problem({
      title: "JWT Expiration Validation Error",
      detail: "JWT is expired",
      status: 401,
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
  options?: ValidateOptions,
) {
  if (!audience.startsWith("https://") && !options?.skipPrependAudience)
    audience = `https://${audience}`
  if (audience.endsWith("/")) audience = audience.slice(0, -1)
  if (Array.isArray(aud)) {
    if (!aud.includes(audience))
      throw new Problem({
        title: "JWT Payload Validation Error",
        detail: `Invalid JWT audience: ${aud.join(",")}`,
        status: 401,
      })
  } else {
    if (aud !== audience) {
      throw new Problem({
        title: "JWT Payload Validation Error",
        detail: `Invalid JWT audience: ${aud}`,
        status: 401,
      })
    }
  }
  if (!issuer.startsWith("https://")) issuer = `https://${issuer}`
  if (!issuer.endsWith("/") && !options?.skipAppendIssuer) issuer = `${issuer}/`
  if (iss !== issuer)
    throw new Problem({
      title: "JWT Payload Validation Error",
      detail: `Invalid JWT issuer: ${iss}`,
      status: 401,
    })
  validateExpiration(exp)
}

function validateHeader(jwt: DecodedJsonWebToken, options?: ValidateOptions) {
  const {
    decoded: {
      header: { typ, alg, kid },
    },
  } = jwt
  if (typ !== "JWT" && !options?.ignoreHeaderType)
    throw new Problem({
      title: "JWT Header Validation Error",
      detail: `Invalid JWT type: ${typ}`,
      status: 401,
    })
  if (alg !== "RS256")
    throw new Problem({
      title: "JWT Header Validation Error",
      detail: `Invalid JWT algorithm: ${alg}`,
      status: 401,
    })
  if (!kid)
    throw new Problem({
      title: "JWT Header Validation Error",
      detail: "Missing JWT key id",
      status: 401,
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
        status: 401,
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
    options?: ValidateOptions,
  ): Promise<void> {
    validateHeader(jwt, options)
    validatePayload(jwt, audience, issuer, options)
    await validateSignature(jwt, options)
  },
}
