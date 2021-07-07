import { Unauthorized } from "../core/responses"

export const Authorizer = (options: {
  validator?: (token: string) => Promise<boolean>
}): {
  authorize: (request: Request) => Promise<void | Response>
} => {
  let { validator } = options

  const getTokenFromHeaders = (headers: Headers): string | undefined => {
    const header = headers.get("Authorization")
    return header ? header.split(" ")?.[1] : undefined
  }

  const validateToken = async (token: string): Promise<boolean> => true

  const authorize = async (request: Request): Promise<void | Response> => {
    const token = getTokenFromHeaders(request.headers)
    if (!validator) validator = validateToken
    if (!token || !(await validator(token))) return Unauthorized()
  }

  return {
    authorize,
  }
}
