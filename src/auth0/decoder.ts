import { Problem } from "../core"
import { base64 } from "../utils"

export class Auth0DecoderError extends Problem {
  constructor(detail: string) {
    super({
      detail,
      status: 500,
      title: "An error occured while decoding the JWT",
      type: "Auth0DecodeError",
    })
  }
}

export const decode = (token: string): JWT => {
  try {
    const [header, payload, signature] = token.split(".")
    return {
      header: JSON.parse(atob(header)),
      payload: JSON.parse(atob(payload)),
      signature: base64.encode(signature),
    }
  } catch {
    throw new Auth0DecoderError("Unable to decode JWT")
  }
}
