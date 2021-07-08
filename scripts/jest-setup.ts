import makeServiceWorkerEnv from 'service-worker-mock'
import crypto from "crypto"

declare const global: unknown

beforeEach(() => {
  Object.assign(global, makeServiceWorkerEnv())
  Object.assign(global, {
    crypto: { getRandomValues: crypto.randomFillSync },
    btoa: (x: string) => Buffer.from(x, "binary").toString("base64"),
    atob: (x: string) => Buffer.from(x, "base64").toString("binary")
  })
  jest.resetModules()
})