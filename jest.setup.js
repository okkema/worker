/* eslint-disable no-undef */
import makeServiceWorkerEnv from "service-worker-mock"

beforeEach(() => {
  Object.assign(global, makeServiceWorkerEnv())
  jest.resetModules()
})

afterEach(() => {
  jest.clearAllMocks()
})
