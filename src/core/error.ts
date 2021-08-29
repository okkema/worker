type CoreErrorInit = Partial<Omit<CoreError, "name" | "message" | "stack">> & Pick<CoreError, "type">

class CoreError extends Error {
  type: string
  title: string
  status: number
  detail: string

  constructor(init: CoreErrorInit = { type: "CoreError"}) {
    super()
    // Error
    this.name = init.type
    this.message = init?.title ?? init.type
    // Problem Details
    this.type = init?.type ?? init.type
    this.title = init?.title ?? init.type
    this.status = init?.status ?? 500
    this.detail = init?.detail ?? init.type
  }
}

export default CoreError
