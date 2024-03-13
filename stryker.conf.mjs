// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  packageManager: "npm",
  testRunner: "vitest",
  checkers: ["typescript"],
  reporters: ["html", "clear-text", "progress"],
  tempDirName: "artifacts/stryker/temp",
  htmlReporter: {
    fileName: "artifacts/stryker/report.html",
  },
  vitest: {
    configFile: "vitest.config.ts",
  },
};

export default config;
