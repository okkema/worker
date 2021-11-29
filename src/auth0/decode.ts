import { Problem } from "../core"
import { base64 } from "../utils"

const decode = (token: string): JWT => {
  try {
    const [header, payload, signature] = token.split(".")
    return {
      header: JSON.parse(atob(header)),
      payload: JSON.parse(atob(payload)),
      signature: base64.encode(signature),
    }
  } catch (error) {
    throw new Problem({
      title: "JWT Decode Error",
      detail: `Unable to decode JWT: ${error}`,
    })
  }
}

export default decode
