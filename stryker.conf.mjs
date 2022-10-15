// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  tempDirName: "artifacts/stryker/temp",
  packageManager: "yarn",
  reporters: ["html", "clear-text", "progress"],
  htmlReporter: {
    fileName: "artifacts/stryker/report.html",
  },
  testRunner: "jest",
  jest: {
    projectType: "custom",
    configFile: "jest.config.cjs",
    enableFindRelatedTests: false,
  },
  coverageAnalysis: "perTest",
  checkers: ["typescript"],
  tsconfigFile: "tsconfig.json",
  disableTypeChecks: "**/*.ts",
};
export default config;
