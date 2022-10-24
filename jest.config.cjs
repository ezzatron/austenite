/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest/presets/default-esm",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  collectCoverageFrom: ["<rootDir>/src/**/*"],
  coverageDirectory: "artifacts/coverage/jest",
  testMatch: ["<rootDir>/test/suite/**/*.spec.ts"],
  setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
  resetMocks: true,
};

module.exports = config;
