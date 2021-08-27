type Logger = {
  logError: (event: FetchEvent, error: Error) => Promise<boolean>
}
