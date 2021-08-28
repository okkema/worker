/** @type { import("@jest/types").Config.InitialOptions } */
const config = {
  testPathIgnorePatterns: ["./node_modules", "./dist"],
  collectCoverageFrom: ["./src/**/*.{ts,js}"],
  setupFilesAfterEnv: ["./jest.setup.js"],
  snapshotResolver: "./jest.snapshots.js",
}

module.exports = config
