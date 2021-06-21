export const Ok = (body?: BodyInit): Response =>
  new Response(body, { status: 200, statusText: 'Ok' })
