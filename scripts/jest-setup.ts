import makeServiceWorkerEnv from 'service-worker-mock'

declare const global: unknown

beforeEach(() => {
  Object.assign(global, makeServiceWorkerEnv())
  jest.resetModules()
})