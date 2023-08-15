/** @type { import("@jest/types").Config.InitialOptions } */
const config = {
  testPathIgnorePatterns: ["./node_modules", "./dist", "./example"],
  collectCoverageFrom: ["./src/**/*.{ts,js}", "!./src/**/index.ts"],
  setupFilesAfterEnv: ["./jest.setup.js"],
  snapshotResolver: "./jest.snapshots.js",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: ["/node_modules/(?!typed-array-utils?)"],
}

module.exports = config
