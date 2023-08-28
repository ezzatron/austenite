// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  packageManager: "npm",
  testRunner: "jest",
  testRunnerNodeArgs: ["--experimental-vm-modules"],
  checkers: ["typescript"],
  reporters: ["html", "clear-text", "progress"],
  tempDirName: "artifacts/stryker/temp",
  htmlReporter: {
    fileName: "artifacts/stryker/report.html",
  },
  jest: {
    configFile: "jest.config.cjs",
  },
};

export default config;
