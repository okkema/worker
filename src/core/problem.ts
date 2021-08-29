type ProblemInit = Omit<Problem, "name" | "message" | "stack">

class Problem extends Error {
  type: string
  title: string
  status: number
  detail: string

  constructor(init: ProblemInit) {
    super()
    // Error
    this.name = "Problem"
    this.message = init.title
    // Problem Details
    this.type = init.type
    this.title = init.title
    this.status = init.status
    this.detail = init.detail
  }
}

export default Problem
