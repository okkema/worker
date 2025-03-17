import { base64, base64url } from "rfc4648"
import { Problem } from "../core"
import type { JsonWebKey } from "@cloudflare/workers-types"

export const RSA = {
  ALGORITHM: "RSASSA-PKCS1-v1_5",
  HASH: "SHA-256",
  import(
    key: string | JsonWebKey,
    format: "pkcs8" | "jwk",
    uses: "sign" | "verify",
  ): Promise<CryptoKey> {
    let keyData
    if (format === "pkcs8") {
      if (typeof key !== "string")
        throw new Problem({
          title: "RSA Error",
          detail: "PEM key not in string format",
        })
      if (key.includes("\n")) key = key.replace(/\n/g, "")
      let header
      if (key.startsWith("-----BEGIN RSA PRIVATE KEY-----"))
        header = "-----BEGIN RSA PRIVATE KEY-----"
      else header = "-----BEGIN PRIVATE KEY-----"
      let footer
      if (key.endsWith("-----END RSA PRIVATE KEY-----"))
        footer = "-----END RSA PRIVATE KEY-----"
      else footer = "-----END PRIVATE KEY-----"
      const pem = key.substring(header.length, key.length - footer.length)
      keyData = base64.parse(pem, { loose: true })
    } else keyData = key
    return crypto.subtle.importKey(
      format,
      keyData,
      {
        name: this.ALGORITHM,
        hash: this.HASH,
      },
      false,
      [uses],
    )
  },
  async sign(key: CryptoKey, string: string, url?: boolean) {
    const buffer = await crypto.subtle.sign(
      {
        name: this.ALGORITHM,
        hash: { name: this.HASH },
      },
      key,
      new TextEncoder().encode(string),
    )
    if (url) return base64url.stringify(new Uint8Array(buffer), { pad: false })
    return base64.stringify(new Uint8Array(buffer))
  },
  async verify(key: CryptoKey, buffer: Uint8Array, signature: string) {
    return crypto.subtle.verify(
      this.ALGORITHM,
      key,
      buffer,
      new TextEncoder().encode(signature),
    )
  },
  async digest(string: string) {
    const buffer = await crypto.subtle.digest(
      this.HASH,
      new TextEncoder().encode(string),
    )
    return base64.stringify(new Uint8Array(buffer))
  },
}
