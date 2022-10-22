// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  packageManager: "yarn",
  testRunner: "jest",
  checkers: ["typescript"],
  reporters: ["html", "clear-text", "progress"],
  tempDirName: "artifacts/stryker/temp",
  htmlReporter: {
    fileName: "artifacts/stryker/report.html",
  },
  jest: {
    configFile: "jest.stryker.config.cjs",
  },
};

export default config;
