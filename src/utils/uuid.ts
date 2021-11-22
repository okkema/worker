import randomize from "./randomize"

const uuid = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    let array
    if (char === "y") {
      array = ["8", "9", "a", "b"]
      return array[Math.floor(Math.random() * array.length)]
    }
    array = randomize(1)
    return (array[0] % 16).toString(16)
  })
}

export default uuid
