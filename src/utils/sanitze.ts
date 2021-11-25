/**
 * Remove null and undefined values from an object. Supports nested objects.
 * @param {object} obj Dirty object
 * @returns {object} Sanitized object
 */
const sanitize = (obj: Record<string, unknown>): Record<string, unknown> => {
  return Object.fromEntries(
    Object.entries(obj)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
