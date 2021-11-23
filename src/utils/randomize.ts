const randomize = (length: number): Uint8Array =>
  crypto.getRandomValues(new Uint8Array(length))

export default randomize
