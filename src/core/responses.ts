import Problem from "./problem"

const createResponse = (
  status: number,
  statusText: string,
  body?: BodyInit,
  headers?: Headers,
): Response => new Response(body, { status, statusText, headers })

export const Ok = (body: BodyInit = "OK", headers?: Headers): Response =>
  createResponse(200, "OK", body, headers)

export const NoContent = (headers?: Headers): Response =>
  createResponse(204, "No Content", null, headers)

export const BadRequest = (
  body: BodyInit = "Bad Request",
  headers?: Headers,
): Response => createResponse(400, "Bad Request", body, headers)

export const Unauthorized = (
  body: BodyInit = "Unauthorized",
  headers?: Headers,
): Response => createResponse(401, "Unauthorized", body, headers)

export const Forbidden = (
  body: BodyInit = "Forbidden",
  headers?: Headers,
): Response => createResponse(403, "Forbidden", body, headers)

export const NotFound = (
  body: BodyInit = "Not Found",
  headers?: Headers,
): Response => createResponse(404, "Not Found", body, headers)

export const InternalServerError = (
  body: BodyInit = "Internal Server Error",
  headers?: Headers,
): Response => createResponse(500, "Internal Server Error", body, headers)

export const ProblemDetails = (problem: Problem): Response => {
  const { detail, status, title, type } = problem
  return createResponse(
    status,
    "Problem Details",
    JSON.stringify({ detail, status, title, type }),
    new Headers({ "Content-Type": "application/json" }),
  )
}
