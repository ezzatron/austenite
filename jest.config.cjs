module.exports = {
  preset: "es-jest",
  transform: {
    "\\.tsx?$": "ts-jest",
  },
  transformIgnorePatterns: [],
  collectCoverageFrom: ["src/**/*"],
  coverageDirectory: "artifacts/coverage/jest",
  testMatch: ["<rootDir>/test/suite/**/*.spec.*"],
};
