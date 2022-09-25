import { Console } from "node:console";
import { Transform } from "node:stream";
import { EOL } from "os";
import { boolean, initialize, string } from "../../src";
import { reset } from "../../src/environment";

describe("Validation summary", () => {
  let env: typeof process.env;
  let readConsole: () => string;

  beforeEach(() => {
    jest.spyOn(process, "exit").mockImplementation();

    env = process.env;
    process.env = { ...env };

    const stdout = new Transform({
      transform(chunk, _, cb) {
        cb(null, chunk);
      },
    });
    const mockConsole = new Console({ stdout });

    jest
      .spyOn(console, "log")
      .mockImplementation(mockConsole.log.bind(mockConsole));

    readConsole = () => String(stdout.read() ?? "");
  });

  afterEach(() => {
    jest.resetAllMocks();
    process.env = env;
    reset();
  });

  describe("when there are required variables with no defaults", () => {
    beforeEach(() => {
      process.env.AUSTENITE_BOOLEAN = "y";
      process.env.AUSTENITE_STRING = "hello, world!";

      string("AUSTENITE_XTRIGGER", "trigger failure");
      string("AUSTENITE_STRING", "example string");
      boolean("AUSTENITE_BOOLEAN", "example boolean", {
        literals: { true: ["y", "yes"], false: ["n", "no"] },
      });

      initialize();
    });

    it("outputs a summary table", () => {
      expect(readConsole()).toBe(
        [
          `Environment Variables:`,
          ``,
          `  AUSTENITE_BOOLEAN   example boolean    y | yes | n | no    ✓ set to true`,
          `  AUSTENITE_STRING    example string     <string>            ✓ set to "hello, world!"`,
          `❯ AUSTENITE_XTRIGGER  trigger failure    <string>            ✗ undefined`,
          ``,
        ].join(EOL)
      );
    });
  });

  describe("when there are variables with defaults", () => {
    beforeEach(() => {
      string("AUSTENITE_XTRIGGER", "trigger failure");
      string("AUSTENITE_STRING", "example string", {
        default: "hello, world!",
      });
      boolean("AUSTENITE_BOOLEAN", "example boolean", {
        default: true,
        literals: { true: ["y", "yes"], false: ["n", "no"] },
      });

      initialize();
    });

    it("outputs a summary table", () => {
      expect(readConsole()).toBe(
        [
          `Environment Variables:`,
          ``,
          `  AUSTENITE_BOOLEAN   example boolean  [ y | yes | n | no ] = true     ✓ using default value`,
          `  AUSTENITE_STRING    example string   [ <string> ] = "hello, world!"  ✓ using default value`,
          `❯ AUSTENITE_XTRIGGER  trigger failure    <string>                      ✗ undefined`,
          ``,
        ].join(EOL)
      );
    });
  });
});
