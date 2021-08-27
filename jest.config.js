/** @type { import("@jest/types").Config.InitialOptions } */
const config = {
  transform: {
    "^.+\\.(t|j)sx?$": "ts-jest",
  },
  testPathIgnorePatterns: ["node_modules", "dist"],
  collectCoverageFrom: ["src/**/*.{ts,js}"],
  setupFilesAfterEnv: ["./jest.setup.ts"],
  snapshotResolver: "./jest.snapshots.js",
}

module.exports = config
