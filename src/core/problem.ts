import { sanitize } from "../utils"

/**
 * @typedef {object} ProblemInit
 * @property {string} [type]
 * @property {string} title
 * @property {number} [status] Default: 500
 * @property {string} details
 */
export type ProblemInit = Pick<Problem, "type" | "title" | "status" | "detail">

/**
 * A customizable error. Used to generate a Problem Details response.
 * @extends {Error}
 * @constructor
 * @param {ProblemInit} init
 * @see https://datatracker.ietf.org/doc/html/rfc7807
 */
export class Problem extends Error {
  title: string
  detail: string
  type?: string
  status?: number
  response: Response

  constructor(init: ProblemInit) {
    super()
    // Error
    this.name = init.title.replace(/\s/g, "")
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
