export class CoreError extends Error {
  constructor(message = "CoreError") {
    super(message)
    this.name = this.constructor.name
  }
}
