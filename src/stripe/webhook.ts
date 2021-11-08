import {
  bytesToHexString,
  compareBufferSources,
  hexStringToBytes,
} from "typed-array-utils"
import { Problem } from "../core"

type StripeWebhook = {
  validate: (body: string, header: string) => Promise<boolean>
  create: (body: string) => Promise<string>
}

type StripeWebhookInit = {
  secret: string
  scheme?: "v1"
  tolerance?: number
}

const StripeWebhook = (init: StripeWebhookInit): StripeWebhook => {
  const { secret } = init
  const scheme = init.scheme ?? "v1"
  const tolerance = init.tolerance ?? 300

  const parseHeader = (
    header: string,
    scheme: string,
  ): { timestamp: number; signatures: string[] } | null => {
    if (typeof header !== "string") return null
    return header.split(",").reduce(
      (prev, curr) => {
        const kv = curr.split("=")
        if (kv[0] === "t") prev.timestamp = Number(kv[1])
        if (kv[0] === scheme) prev.signatures.push(kv[1])
        return prev
      },
      {
        timestamp: -1,
        signatures: [] as string[],
      },
    )
  }

  const computeSignature = async (signedPayload: string, secret: string) => {
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["sign"],
    )
    const signature = await crypto.subtle.sign(
      { name: "HMAC" },
      cryptoKey,
      new TextEncoder().encode(signedPayload),
    )
    return signature
  }

  const compareBufferSourceTo = (expected: BufferSource) => {
    return (candidate: ArrayBuffer) => {
      return compareBufferSources(expected, candidate)
    }
  }

  return {
    validate: async (body, header) => {
      const details = parseHeader(header, scheme)
      if (!details || details.timestamp === -1)
        throw new Problem({
          title: "Stripe Webhook Error",
          detail: "Unable to extract timestamp and signatures from header.",
        })
      if (!details.signatures.length)
        throw new Problem({
          title: "Stripe Webhook Error",
          detail: "No signatures found with expected scheme.",
        })
      const signature = await computeSignature(
        `${details.timestamp}.${body}`,
        secret,
      )
      const found = !!details.signatures
        .map(hexStringToBytes)
        .filter(compareBufferSourceTo(signature)).length
      if (!found)
        throw new Problem({
          title: "Stripe Webhook Error",
          detail: "No signatures found matching the expected signature.",
        })
      const timestamp =
        Math.floor(Date.now() / 1000) - Number(details.timestamp)
      if (tolerance > 0 && timestamp > tolerance)
        throw new Problem({
          title: "Stipe Webhook Error",
          detail: "Timestamp outside the tolerance zone.",
        })
      return true
    },
    create: async (body: string) => {
      const timestamp = Math.floor(new Date().getTime() / 1000 + tolerance)
      const signature = bytesToHexString(
        await computeSignature(`${timestamp}.${body}`, secret),
      )
      return `t=${timestamp},${scheme}=${signature}`
    },
  }
}

export default StripeWebhook
