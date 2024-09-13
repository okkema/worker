/* eslint-disable @typescript-eslint/no-explicit-any */
import { captureMessage, type SeverityLevel } from "@sentry/cloudflare"

type Logger = {
  debug(...args: any[]): void
  error(...args: any[]): void
  info(...args: any[]): void
  warn(...args: any[]): void
}

function sendToSentry(level: SeverityLevel, ...args: any[]) {
  captureMessage(
    `${args.reduce(function (prev, curr) {
      if (typeof curr === "object") prev += ` ${JSON.stringify(curr)}`
      else prev += ` ${curr}`
      return prev
    }, "")}`,
    level,
  )
}

export const Logger: Logger = {
  debug(...args) {
    console.debug(...args)
    sendToSentry("debug", ...args)
  },
  error(...args) {
    console.error(...args)
    sendToSentry("error", ...args)
  },
  info(...args) {
    console.info(...args)
    sendToSentry("info", ...args)
  },
  warn(...args) {
    console.warn(...args)
    sendToSentry("warning", ...args)
  },
}
