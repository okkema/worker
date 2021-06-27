import { router } from "./routes"
import { Worker } from "./core/worker"

Worker(router.handle).listen()
