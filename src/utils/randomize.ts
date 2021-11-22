const randomize = (length: number) =>
  crypto.getRandomValues(new Uint8Array(length))

export default randomize
