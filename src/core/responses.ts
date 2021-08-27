import CoreError from "./error"

const createResponse = (
  status: number,
  statusText: string,
  body?: BodyInit,
  headers?: Headers,
): Response => new Response(body, { status, statusText, headers })

export const Ok = (body: BodyInit = "OK"): Response =>
  createResponse(200, "OK", body)

export const NoContent = (): Response => createResponse(204, "No Content")

export const BadRequest = (body: BodyInit = "Bad Request"): Response =>
  createResponse(400, "Bad Request", body)

export const Unauthorized = (body: BodyInit = "Unauthorized"): Response =>
  createResponse(401, "Unauthorized", body)

export const Forbidden = (body: BodyInit = "Forbidden"): Response =>
  createResponse(403, "Forbidden", body)

export const NotFound = (body: BodyInit = "Not Found"): Response =>
  createResponse(404, "Not Found", body)

export const InternalServerError = (
  body: BodyInit = "Internal Server Error",
): Response => createResponse(500, "Internal Server Error", body)

export const ProblemDetails = (error: CoreError): Response => {
  const { detail, name, status, title, type } = error
  return createResponse(
    status,
    name,
    JSON.stringify({ detail, status, title, type }),
    new Headers({ "Content-Type": "application/json" }),
  )
}
