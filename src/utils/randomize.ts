export function randomize(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length))
}
