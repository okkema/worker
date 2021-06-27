import { router } from "./routes"
import { Worker } from "./core/worker"

Worker({ handler: router.handle })
