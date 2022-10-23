import { jest } from "@jest/globals";
import { reset } from "../src/environment.js";

let argv: typeof process.argv;
let env: typeof process.env;

beforeEach(() => {
  jest.spyOn(process, "exit").mockImplementation(() => {
    return undefined as never;
  });

  argv = process.argv;
  process.argv = [process.argv0, "<app>"];

  env = process.env;
  process.env = { ...env };
});

afterEach(() => {
  process.argv = argv;
  process.env = env;

  reset();
});
