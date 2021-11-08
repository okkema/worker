const sanitize = (obj: Record<string, unknown>): Record<string, unknown> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => !(v === null || v === undefined)),
  )
}

export default sanitize
