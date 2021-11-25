export default {
  /**
   * Encodes a URL safe base64 string.
   * @param {string} value String to be encoded
   * @returns {string} URL safe base64 encoded string
   */
  encode: (value: string): string => {
    return btoa(
      encodeURIComponent(value).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode(parseInt(p1, 16))
      }),
    )
  },
  /**
   * Decodes a URL safe base64 string.
   * @param {string} value URL safe base64 encoded string
   * @returns {string} Decoded string
   */
  decode: (value: string): string => {
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(value), (c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join(""),
    )
  },
}
