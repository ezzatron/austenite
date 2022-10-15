import { EOL } from "os";
import { boolean, initialize, kubernetesAddress, string } from "../../src";
import { registerVariable, reset, setProcessExit } from "../../src/environment";
import { undefinedValue } from "../../src/maybe";
import { createString } from "../../src/schema";
import { VariableSpec } from "../../src/variable";
import { createMockConsole, MockConsole } from "../helpers";

describe("Validation summary", () => {
  let exitCode: number | undefined;
  let env: typeof process.env;
  let mockConsole: MockConsole;

  function processExit(code: number): never {
    exitCode = code;

    return undefined as never;
  }

  beforeEach(() => {
    exitCode = undefined;
    setProcessExit(processExit);

    env = process.env;
    process.env = { ...env };

    mockConsole = createMockConsole();
  });

  afterEach(() => {
    jest.resetAllMocks();
    process.env = env;
    reset();
  });

  it("summarizes required variables", () => {
    process.env.AUSTENITE_BOOLEAN = "y";
    process.env.AUSTENITE_STRING = "hello, world!";
    process.env.AUSTENITE_SVC_SERVICE_HOST = "host.example.org";
    process.env.AUSTENITE_SVC_SERVICE_PORT = "443";

    string("AUSTENITE_XTRIGGER", "trigger failure");
    kubernetesAddress("austenite-svc");
    string("AUSTENITE_STRING", "example string");
    boolean("AUSTENITE_BOOLEAN", "example boolean", {
      literals: { true: ["y", "yes"], false: ["n", "no"] },
    });

    initialize();

    expect(mockConsole.readStderr()).toBe(
      [
        "Environment Variables:",
        "",
        "  AUSTENITE_BOOLEAN           example boolean                            y | yes | n | no    ✓ set to y",
        "  AUSTENITE_STRING            example string                             <string>            ✓ set to 'hello, world!'",
        "  AUSTENITE_SVC_SERVICE_HOST  kubernetes `austenite-svc` service host    <string>            ✓ set to host.example.org",
        "  AUSTENITE_SVC_SERVICE_PORT  kubernetes `austenite-svc` service port    <string>            ✓ set to 443",
        "❯ AUSTENITE_XTRIGGER          trigger failure                            <string>            ✗ undefined",
        "",
      ].join(EOL)
    );
    expect(exitCode).toBeGreaterThan(0);
  });

  it("summarizes optional variables with no defaults", () => {
    string("AUSTENITE_XTRIGGER", "trigger failure");
    kubernetesAddress("austenite-svc", {
      default: undefined,
    });
    string("AUSTENITE_STRING", "example string", {
      default: undefined,
    });
    boolean("AUSTENITE_BOOLEAN", "example boolean", {
      default: undefined,
      literals: { true: ["y", "yes"], false: ["n", "no"] },
    });

    initialize();

    expect(mockConsole.readStderr()).toBe(
      [
        "Environment Variables:",
        "",
        "  AUSTENITE_BOOLEAN           example boolean                          [ y | yes | n | no ]  • undefined",
        "  AUSTENITE_STRING            example string                           [ <string> ]          • undefined",
        "  AUSTENITE_SVC_SERVICE_HOST  kubernetes `austenite-svc` service host  [ <string> ]          • undefined",
        "  AUSTENITE_SVC_SERVICE_PORT  kubernetes `austenite-svc` service port  [ <string> ]          • undefined",
        "❯ AUSTENITE_XTRIGGER          trigger failure                            <string>            ✗ undefined",
        "",
      ].join(EOL)
    );
    expect(exitCode).toBeGreaterThan(0);
  });

  it("summarizes variables with defaults", () => {
    string("AUSTENITE_XTRIGGER", "trigger failure");
    kubernetesAddress("austenite-svc", {
      default: {
        host: "host.example.org",
        port: 443,
      },
    });
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
        "Environment Variables:",
        "",
        "  AUSTENITE_BOOLEAN           example boolean                          [ y | yes | n | no ] = y         ✓ using default value",
        "  AUSTENITE_STRING            example string                           [ <string> ] = 'hello, world!'   ✓ using default value",
        "  AUSTENITE_SVC_SERVICE_HOST  kubernetes `austenite-svc` service host  [ <string> ] = host.example.org  ✓ using default value",
        "  AUSTENITE_SVC_SERVICE_PORT  kubernetes `austenite-svc` service port  [ <string> ] = 443               ✓ using default value",
        "❯ AUSTENITE_XTRIGGER          trigger failure                            <string>                       ✗ undefined",
        "",
      ].join(EOL)
    );
    expect(exitCode).toBeGreaterThan(0);
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
    expect(exitCode).toBeGreaterThan(0);
  });

  it("summarizes misbehaving variables", () => {
    process.env.AUSTENITE_CUSTOM = "custom value";
    process.env.AUSTENITE_STRING = "hello, world!";

    const spec: VariableSpec<string> = {
      name: "AUSTENITE_CUSTOM",
      description: "custom variable",
      default: undefinedValue(),
      schema: createString(),
      examples: [],
      constraint: () => {
        throw {
          toString() {
            return "not really an error";
          },
        };
      },
    };

    registerVariable(spec);
    string("AUSTENITE_STRING", "example string");

    initialize();

    expect(mockConsole.readStderr()).toBe(
      [
        "Environment Variables:",
        "",
        "❯ AUSTENITE_CUSTOM  custom variable    <string>    ✗ set to 'custom value', not really an error",
        "  AUSTENITE_STRING  example string     <string>    ✓ set to 'hello, world!'",
        "",
      ].join(EOL)
    );
    expect(exitCode).toBeGreaterThan(0);
  });
});
