import { handler } from "./routes"
import Worker from "./core/worker"
import SentryLogger from "./sentry/logger"

declare const DSN: string

Worker({ handler: handler, logger: SentryLogger({ DSN }) })
