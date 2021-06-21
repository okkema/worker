module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.{ts,js}'],
  setupFilesAfterEnv: ["<rootDir>/scripts/jest-setup.ts"]
}
