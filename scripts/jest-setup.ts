import makeServiceWorkerEnv from 'service-worker-mock'
import crypto from "crypto"

declare const global: unknown

beforeEach(() => {
  Object.assign(global, makeServiceWorkerEnv())
  Object.assign(global, {
    crypto: { getRandomValues: crypto.randomFillSync },
  })
  jest.resetModules()
})