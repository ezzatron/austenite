const baseConfig = require("./jest.config.cjs");

/** @type {import('jest').Config} */
const config = {
  ...baseConfig,
  testPathIgnorePatterns: ["<rootDir>/test/suite/index.spec.ts"],
};

module.exports = config;
