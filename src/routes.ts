import { Router } from "itty-router"
import { Ok } from "./core/responses"

const router = Router()

router.get("/", ({ url }) => Ok(url))

export const handler = (event: FetchEvent): Promise<Response> =>
  router.handle(event.request)
