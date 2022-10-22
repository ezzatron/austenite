/** @type {import('jest').Config} */
const config = {
  preset: "es-jest",
  transform: {
    "\\.tsx?$": "ts-jest",
  },
  transformIgnorePatterns: [],
  collectCoverageFrom: ["src/**/*"],
  coverageDirectory: "artifacts/coverage/jest",
  testMatch: ["<rootDir>/test/suite/**/*.spec.*"],
  setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
  resetMocks: true,
};

module.exports = config;
