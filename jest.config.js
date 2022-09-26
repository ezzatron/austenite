export default {
  preset: "es-jest",
  transform: {
    "\\.tsx?$": "ts-jest",
  },
  transformIgnorePatterns: [],
  collectCoverageFrom: ["src/**/*"],
  coverageDirectory: "artifacts/coverage/jest",
  testMatch: ["**/test/suite/**/*.spec.*"],
};
