import { handler } from "./routes"
import Worker from "./core/worker"
import { Logger } from "./sentry/logger"

declare const DSN: string

Worker({ handler: handler, logger: Logger({ DSN }).log })