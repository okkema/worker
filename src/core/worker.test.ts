import { Problem } from "./problem"
import { Worker } from "./worker"

describe("Worker", () => {
  describe("fetch", () => {
    it("calls the handler", async () => {
      // Arrange
      const fetch = jest.fn()
      const worker = Worker({ fetch })
      const request = new Request("/")
      const environment = {}
      const context = jest.fn()
      // Act
      await worker.fetch?.(request, environment, context)
      // Assert
      expect(fetch).toHaveBeenCalledWith(request, environment, context)
    })
    it("responds to a request", async () => {
      // Arrange
      const response = new Response()
      const fetch = jest.fn(() => response)
      const worker = Worker({ fetch })
      const request = new Request("/")
      const environment = {}
      const context = jest.fn()
      // Act
      const result = await worker.fetch?.(request, environment, context)
      // Assert
      expect(fetch).toHaveBeenCalledWith(request, environment, context)
      expect(result).toBe(response)
    })
    describe("on error", () => {
      it("calls the logger if present", async () => {
        // Arrange
        const err = new Error()
        const fetch = jest.fn(() => {
          throw err
        })
        const error = jest.fn()
        const worker = Worker({ fetch, logger: { error } })
        const request = new Request("/")
        const waitUntil = jest.fn()
        const environment = {}
        const context = { waitUntil }
        // Act
        await worker.fetch?.(request, environment, context)
        // Assert
        expect(fetch).toHaveBeenCalledWith(request, environment, context)
        expect(error).toBeCalledWith(request, err, environment)
        expect(waitUntil).toHaveBeenCalled()
      })
      it("returns problem details if expected", async () => {
        // Arrange
        const init = {
          detail: "detail",
          status: 403,
          title: "title",
          type: "type",
        }
        const fetch = jest.fn(() => {
          throw new Problem(init)
        })
        const worker = Worker({ fetch })
        const request = new Request("/")
        const waitUntil = jest.fn()
        const environment = {}
        const context = { waitUntil }
        // Act
        const result = await worker.fetch?.(request, environment, context)
        // Assert
        expect(fetch).toHaveBeenCalledWith(request, environment, context)
        expect(result?.status).toBe(init.status)
        expect(result?.statusText).toBe("Problem Details")
        const json = await result?.json()
        expect(json).toEqual(init)
      })
      it("returns an 500 if unexpected", async () => {
        // Arrange
        const message = "message"
        const fetch = jest.fn(() => {
          throw new Error(message)
        })
        const worker = Worker({ fetch })
        const request = new Request("/")
        const waitUntil = jest.fn()
        const environment = {}
        const context = { waitUntil }
        // Act
        const result = await worker.fetch?.(request, environment, context)
        // Assert
        expect(fetch).toHaveBeenCalledWith(request, environment, context)
        expect(result?.status).toBe(500)
        const text = await result?.text()
        expect(text).toBe(message)
      })
    })
  })
  describe("scheduled", () => {
    it("calls the handler", async () => {
      // Arrange
      const scheduled = jest.fn()
      const worker = Worker({ scheduled })
      const event = jest.fn()
      const environment = {}
      const context = jest.fn()
      // Act
      await worker.scheduled?.(event, environment, context)
      // Assert
      expect(scheduled).toHaveBeenCalledWith(event, environment, context)
    })
    describe("on error", () => {
      it("catches and forwards the error", async () => {
        // Arrange
        const err = new Error()
        const scheduled = jest.fn(() => {
          throw err
        })
        const worker = Worker({ scheduled })
        const event = jest.fn()
        const environment = {}
        const waitUntil = jest.fn()
        const context = {
          waitUntil,
        }
        // Act
        try {
          await worker.scheduled?.(event, environment, context)
        } catch (error) {
          // Assert
          expect(error).toBe(err)
          expect(scheduled).toHaveBeenCalledWith(event, environment, context)
        }
      })
      it("calls the logger if present", async () => {
        // Arrange
        const err = new Error()
        const scheduled = jest.fn(() => {
          throw err
        })
        const error = jest.fn()
        const worker = Worker({ scheduled, logger: { error } })
        const event = jest.fn()
        const environment = {}
        const waitUntil = jest.fn()
        const context = {
          waitUntil,
        }
        // Act
        try {
          await worker.scheduled?.(event, environment, context)
        } catch (caught) {
          // Assert
          expect(caught).toBe(err)
          expect(scheduled).toHaveBeenCalledWith(event, environment, context)
          expect(error).toHaveBeenCalledWith(event, err, environment)
          expect(waitUntil).toBeCalled()
        }
      })
    })
  })
})
