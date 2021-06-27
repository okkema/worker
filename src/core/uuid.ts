export const uuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    let array
    if (char === "y") {
      array = ["8", "9", "a", "b"]
      return array[Math.floor(Math.random() * array.length)]
    }
    array = new Uint8Array(1)
    crypto.getRandomValues(array)
    return(array[0] % 16).toString(16)
  });
}