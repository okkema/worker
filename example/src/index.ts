import { Problem } from "@okkema/worker/core"
import { API } from "@okkema/worker/api"
import { SentryWorker } from "@okkema/worker/sentry"

const api = API()
api.get("/error", function () {
  throw new Problem({ 
    title: "Simulated Error",
    detail: "An error occurred while invoking the endpoint.", 
  })
})
api.get("/health", function (c) {
  return c.text("success")
})

export default SentryWorker({
  // @ts-expect-error Type 'Request<unknown, IncomingRequestCfProperties<unknown>>' is missing the following properties from type 'Request<unknown, CfProperties<unknown>>': cache, credentials, destination, mode, and 2 more.
  fetch: api.fetch,
})
