import { EOL } from "os";
import { boolean, initialize, string } from "../../src";
import { reset } from "../../src/environment";
import { createMockConsole, MockConsole } from "../helpers";

describe("Validation summary", () => {
  let env: typeof process.env;
  let mockConsole: MockConsole;

  beforeEach(() => {
    jest.spyOn(process, "exit").mockImplementation();

    env = process.env;
    process.env = { ...env };

    mockConsole = createMockConsole();
  });

  afterEach(() => {
    jest.resetAllMocks();
    process.env = env;
    reset();
  });

  it("summarizes required variables with no defaults", () => {
    process.env.AUSTENITE_BOOLEAN = "y";
    process.env.AUSTENITE_STRING = "hello, world!";

    string("AUSTENITE_XTRIGGER", "trigger failure");
    string("AUSTENITE_STRING", "example string");
    boolean("AUSTENITE_BOOLEAN", "example boolean", {
      literals: { true: ["y", "yes"], false: ["n", "no"] },
    });

    initialize();

    expect(mockConsole.readStderr()).toBe(
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

  it("summarizes optional variables with no defaults", () => {
    string("AUSTENITE_XTRIGGER", "trigger failure");
    string("AUSTENITE_STRING", "example string", {
      required: false,
    });
    boolean("AUSTENITE_BOOLEAN", "example boolean", {
      required: false,
      literals: { true: ["y", "yes"], false: ["n", "no"] },
    });

    initialize();

    expect(mockConsole.readStderr()).toBe(
      [
        `Environment Variables:`,
        ``,
        `  AUSTENITE_BOOLEAN   example boolean  [ y | yes | n | no ]  • undefined`,
        `  AUSTENITE_STRING    example string   [ <string> ]          • undefined`,
        `❯ AUSTENITE_XTRIGGER  trigger failure    <string>            ✗ undefined`,
        ``,
      ].join(EOL)
    );
  });

  it("summarizes variables with defaults", () => {
    string("AUSTENITE_XTRIGGER", "trigger failure");
    string("AUSTENITE_STRING", "example string", {
      default: "hello, world!",
    });
    boolean("AUSTENITE_BOOLEAN", "example boolean", {
      default: true,
      literals: { true: ["y", "yes"], false: ["n", "no"] },
    });

    initialize();

    expect(mockConsole.readStderr()).toBe(
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

  it("summarizes invalid values", () => {
    process.env.AUSTENITE_BOOLEAN = "yes";

    string("AUSTENITE_XTRIGGER", "trigger failure");
    // strings cannot really be "invalid" aside from being undefined
    string("AUSTENITE_STRING", "example string");
    boolean("AUSTENITE_BOOLEAN", "example boolean");

    initialize();

    expect(mockConsole.readStderr()).toBe(
      [
        `Environment Variables:`,
        ``,
        `❯ AUSTENITE_BOOLEAN   example boolean    true | false    ✗ set to yes, expected true or false`,
        `❯ AUSTENITE_STRING    example string     <string>        ✗ undefined`,
        `❯ AUSTENITE_XTRIGGER  trigger failure    <string>        ✗ undefined`,
        ``,
      ].join(EOL)
    );
  });
});
