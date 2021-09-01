export const encode = (signature: string): string => {
  return btoa(
    encodeURIComponent(signature).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode(parseInt(p1, 16))
    }),
  )
}

export const decode = (binary: string): string => {
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(binary), (c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join(""),
  )
}
