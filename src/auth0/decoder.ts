import Problem from "../core/problem"

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
