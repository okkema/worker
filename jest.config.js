/** @type { import("@jest/types").Config.InitialOptions } */
const config = {
  testPathIgnorePatterns: ["./node_modules", "./dist", "./example"],
  collectCoverageFrom: ["./src/**/*.{ts,js}"],
  setupFilesAfterEnv: ["./jest.setup.js"],
  snapshotResolver: "./jest.snapshots.js",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
}

module.exports = config
