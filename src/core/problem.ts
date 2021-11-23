import { sanitize } from "../utils"

type ProblemInit = Pick<Problem, "type" | "title" | "status" | "detail">

class Problem extends Error {
  title: string
  detail: string
  type?: string
  status?: number
  response: Response

  constructor(init: ProblemInit) {
    super()
    // Error
    this.name = init.title
    this.message = init.detail
    // Problem Details
    this.type = init.type
    this.title = init.title
    this.status = init.status ?? 500
    this.detail = init.detail
    // response
    this.response = new Response(
      JSON.stringify(
        sanitize({
          detail: this.detail,
          status: this.status,
          title: this.title,
          type: this.type,
        }),
      ),
      {
        status: this.status,
        statusText: "Problem Details",
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

export default Problem
