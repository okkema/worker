import CoreError from "../core/error"

export class Auth0DecoderError extends CoreError {
  constructor(detail = "Auth0DecoderError") {
    super({detail})
  }
}

export const decode = (token: string): JWT => {
  try {
    const [header, payload, signature] = token.split(".")
    return {
      header: JSON.parse(atob(header)),
      payload: JSON.parse(atob(payload)),
      signature: utf8tob(signature),
    }
  } catch {
    throw new Auth0DecoderError("Unable to decode JWT")
  }
}

const utf8tob = (signature: string): string => {
  return btoa(
    encodeURIComponent(signature).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode(parseInt(p1, 16))
    }),
  )
}
