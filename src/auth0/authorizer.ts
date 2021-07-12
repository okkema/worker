import { Unauthorized } from "../core/responses"
import { validateToken } from "./validator"

export const Authorizer = (options: {
  audience: string
  issuer: string
}): {
  authorize: (request: Request) => Promise<void | Response>
} => {
  const { audience, issuer } = options

  const getTokenFromHeaders = (headers: Headers): string | undefined => {
    const header = headers.get("Authorization")
    return header ? header.split(" ")?.[1] : undefined
  }

  const authorize = async (request: Request): Promise<void | Response> => {
    const token = getTokenFromHeaders(request.headers)
    if (!token) return Unauthorized("Missing token")
    if (!(await validateToken(token, audience, issuer)))
      return Unauthorized("Token invalid")
  }

  return {
    authorize,
  }
}
