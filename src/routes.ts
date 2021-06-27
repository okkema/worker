import { Router } from "itty-router"
import { Ok } from "./core/responses"

export const router = Router()

router.get("/", ({ url }) => Ok(url))
