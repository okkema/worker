export class CoreError extends Error {
  constructor(message: string = "CoreError") {
    super(message)
    this.name = this.constructor.name
  }
}
