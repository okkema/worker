/** @type { import("@jest/types").Config.InitialOptions } */
const config = {
  transform: {
    "^.+\\.(t|j)sx?$": "ts-jest",
  },
  collectCoverageFrom: ["src/**/*.{ts,js}"],
  setupFilesAfterEnv: ["./jest.setup.ts"],
}

module.exports = config
