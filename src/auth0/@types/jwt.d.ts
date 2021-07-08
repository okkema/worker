type JWT = {
  header: {
    alg: string
    typ: string
  }
  payload: {
    iss: string
    sub: string
    aud: string
    exp: number
  }
  signature: string
}
