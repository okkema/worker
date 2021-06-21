import { router } from "./router"

export const Worker = (): void => {
  addEventListener("fetch", (event) => {
    event.respondWith(router.handle(event.request))
  })
}