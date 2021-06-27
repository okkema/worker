import { handler } from "./routes"
import { Worker } from "./core/worker"

Worker({ handler: handler })
