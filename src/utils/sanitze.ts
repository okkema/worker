const sanitize = (obj: Record<string, unknown>): Record<string, unknown> => {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([key, value]) => !(value === null || value === undefined))
      .map(([key, value]) => [
        key,
        value === Object(value)
          ? sanitize(value as Record<string, unknown>)
          : value,
      ]),
  )
}

export default sanitize
