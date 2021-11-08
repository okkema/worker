type ProblemInit = Pick<Problem, "type" | "title" | "status" | "detail">

class Problem extends Error {
  title: string
  detail: string
  type?: string
  status?: number

  constructor(init: ProblemInit) {
    super()
    // Error
    this.name = "Problem"
    this.message = init.title
    // Problem Details
    this.type = init.type
    this.title = init.title
    this.status = init.status ?? 500
    this.detail = init.detail
  }
}

export default Problem
