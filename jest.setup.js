/* eslint-disable no-undef */
import makeServiceWorkerEnv from "service-worker-mock"
import { Crypto } from "@peculiar/webcrypto"

beforeEach(() => {
  Object.assign(global, makeServiceWorkerEnv())
  Object.assign(global, {
    crypto: new Crypto(),
    btoa: (x) => Buffer.from(x, "binary").toString("base64"),
    atob: (x) => Buffer.from(x, "base64").toString("binary"),
  })
  jest.resetModules()
})

afterEach(() => {
  jest.resetAllMocks()
})
