import makeServiceWorkerEnv from "service-worker-mock"
import crypto from "crypto"

beforeEach(() => {
  Object.assign(global, makeServiceWorkerEnv())
  Object.assign(global, {
    crypto: { getRandomValues: crypto.randomFillSync },
    btoa: (x) => Buffer.from(x, "binary").toString("base64"),
    atob: (x) => Buffer.from(x, "base64").toString("binary"),
  })
  jest.resetModules()
})
