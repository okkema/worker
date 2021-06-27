export const Worker = (
  requestHandler: (req: Request) => Response | Promise<Response>,
): { eventHandler: (event: FetchEvent) => void; listen: () => void } => {
  const eventHandler = (event: FetchEvent) =>
    event.respondWith(requestHandler(event.request))
  const listen = () => addEventListener("fetch", eventHandler)
  return {
    eventHandler,
    listen,
  }
}
