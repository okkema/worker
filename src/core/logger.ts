/* eslint-disable @typescript-eslint/no-explicit-any */
export type Logger = {
  debug(...args: any[]): void
  error(...args: any[]): void
  info(...args: any[]): void
  warn(...args: any[]): void
}

export const ConsoleLogger: Logger = {
  debug(...args) {
    console.debug(...args)
  },
  error(...args) {
    console.error(...args)
  },
  info(...args) {
    console.info(...args)
  },
  warn(...args) {
    console.warn(...args)
  },
}
