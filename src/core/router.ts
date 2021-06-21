import { Router } from "itty-router";
import { Ok } from "./responses";

export const router = Router()

router.get("/", ({url}) => Ok(url))