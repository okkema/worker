type CoreErrorInit = Partial<Omit<CoreError, "name" | "message" | "stack">>

class CoreError extends Error {
  type: string
  title: string
  status: number
  detail: string

  constructor(init?: CoreErrorInit) {
    super()
    // Error
    this.name = this.constructor.name
    this.message = init?.title ?? this.constructor.name
    // Problem Details
    this.type = init?.type ?? this.constructor.name
    this.title = init?.title ?? this.constructor.name
    this.status = init?.status ?? 500
    this.detail = init?.detail ?? this.constructor.name
  }
}

export default CoreError
