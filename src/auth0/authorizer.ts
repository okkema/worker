import { Problem } from "../core"
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
    if (!token)
      throw new Problem({
        status: 401,
        title: "Unauthorized",
        detail: "Missing token",
      })
    if (!(await validateToken(token, audience, issuer)))
      throw new Problem({
        status: 401,
        title: "Unauthorized",
        detail: "Invalid token",
      })
  }

  return {
    authorize,
  }
}
