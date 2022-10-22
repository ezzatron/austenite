import { Temporal } from "@js-temporal/polyfill";
import { EOL } from "os";
import {
  bigInteger,
  boolean,
  duration,
  enumeration,
  initialize,
  integer,
  kubernetesAddress,
  number,
  string,
  url,
} from "../../src";
import { registerVariable } from "../../src/environment";
import { undefinedValue } from "../../src/maybe";
import { createString } from "../../src/schema";
import { VariableSpec } from "../../src/variable";
import { createMockConsole, MockConsole } from "../helpers";

const { Duration } = Temporal;

describe("Validation summary", () => {
  let exitCode: number | undefined;
  let mockConsole: MockConsole;

  beforeEach(() => {
    exitCode = undefined;
    jest.spyOn(process, "exit").mockImplementation((code) => {
      exitCode = code ?? 0;

      return undefined as never;
    });

    mockConsole = createMockConsole();
  });

  it("summarizes required variables", () => {
    process.env.AUSTENITE_BOOLEAN = "y";
    process.env.AUSTENITE_DURATION = "PT3H20M";
    process.env.AUSTENITE_ENUMERATION = "foo";
    process.env.AUSTENITE_INTEGER = "-123456";
    process.env.AUSTENITE_INTEGER_BIG = "-12345678901234567890";
    process.env.AUSTENITE_NUMBER = "-123.456";
    process.env.AUSTENITE_STRING = "Season's greetings, world!";
    process.env.AUSTENITE_SVC_SERVICE_HOST = "host.example.org";
    process.env.AUSTENITE_SVC_SERVICE_PORT = "443";
    process.env.AUSTENITE_URL = "https://host.example.org/path/to/resource";

    string("AUSTENITE_XTRIGGER", "trigger failure");
    url("AUSTENITE_URL", "example URL");
    kubernetesAddress("austenite-svc");
    string("AUSTENITE_STRING", "example string");
    number("AUSTENITE_NUMBER", "example number");
    bigInteger("AUSTENITE_INTEGER_BIG", "example big integer");
    integer("AUSTENITE_INTEGER", "example integer");
    enumeration("AUSTENITE_ENUMERATION", "example enumeration", {
      foo: {
        value: "foo",
        description: "foo",
      },
      bar: {
        value: "bar",
        description: "bar",
      },
      baz: {
        value: "baz",
        description: "baz",
      },
    });
    duration("AUSTENITE_DURATION", "example duration");
    boolean("AUSTENITE_BOOLEAN", "example boolean", {
      literals: {
        y: true,
        yes: true,
        n: false,
        no: false,
      },
    });

    initialize();

    expect(mockConsole.readStderr()).toBe(
      [
        "Environment Variables:",
        "",
        "  AUSTENITE_BOOLEAN           example boolean                            y | yes | n | no       ✓ set to y",
        "  AUSTENITE_DURATION          example duration                           <ISO 8601 duration>    ✓ set to PT3H20M",
        "  AUSTENITE_ENUMERATION       example enumeration                        foo | bar | baz        ✓ set to foo",
        "  AUSTENITE_INTEGER           example integer                            <integer>              ✓ set to -123456",
        "  AUSTENITE_INTEGER_BIG       example big integer                        <integer>              ✓ set to -12345678901234567890",
        "  AUSTENITE_NUMBER            example number                             <number>               ✓ set to -123.456",
        `  AUSTENITE_STRING            example string                             <string>               ✓ set to 'Season'"'"'s greetings, world!'`,
        "  AUSTENITE_SVC_SERVICE_HOST  kubernetes `austenite-svc` service host    <hostname>             ✓ set to host.example.org",
        "  AUSTENITE_SVC_SERVICE_PORT  kubernetes `austenite-svc` service port    <port number>          ✓ set to 443",
        "  AUSTENITE_URL               example URL                                <URL>                  ✓ set to https://host.example.org/path/to/resource",
        "❯ AUSTENITE_XTRIGGER          trigger failure                            <string>               ✗ undefined",
        "",
      ].join(EOL)
    );
    expect(exitCode).toBeGreaterThan(0);
  });

  it("summarizes optional variables with no defaults", () => {
    string("AUSTENITE_XTRIGGER", "trigger failure");
    url("AUSTENITE_URL", "example URL", {
      default: undefined,
    });
    kubernetesAddress("austenite-svc", {
      default: undefined,
    });
    string("AUSTENITE_STRING", "example string", {
      default: undefined,
    });
    number("AUSTENITE_NUMBER", "example number", {
      default: undefined,
    });
    bigInteger("AUSTENITE_INTEGER_BIG", "example big integer", {
      default: undefined,
    });
    integer("AUSTENITE_INTEGER", "example integer", {
      default: undefined,
    });
    enumeration(
      "AUSTENITE_ENUMERATION",
      "example enumeration",
      {
        foo: {
          value: "foo",
          description: "foo",
        },
        bar: {
          value: "bar",
          description: "bar",
        },
        baz: {
          value: "baz",
          description: "baz",
        },
      },
      {
        default: undefined,
      }
    );
    duration("AUSTENITE_DURATION", "example duration", {
      default: undefined,
    });
    boolean("AUSTENITE_BOOLEAN", "example boolean", {
      default: undefined,
      literals: {
        y: true,
        yes: true,
        n: false,
        no: false,
      },
    });

    initialize();

    expect(mockConsole.readStderr()).toBe(
      [
        "Environment Variables:",
        "",
        "  AUSTENITE_BOOLEAN           example boolean                          [ y | yes | n | no ]     • undefined",
        "  AUSTENITE_DURATION          example duration                         [ <ISO 8601 duration> ]  • undefined",
        "  AUSTENITE_ENUMERATION       example enumeration                      [ foo | bar | baz ]      • undefined",
        "  AUSTENITE_INTEGER           example integer                          [ <integer> ]            • undefined",
        "  AUSTENITE_INTEGER_BIG       example big integer                      [ <integer> ]            • undefined",
        "  AUSTENITE_NUMBER            example number                           [ <number> ]             • undefined",
        "  AUSTENITE_STRING            example string                           [ <string> ]             • undefined",
        "  AUSTENITE_SVC_SERVICE_HOST  kubernetes `austenite-svc` service host  [ <hostname> ]           • undefined",
        "  AUSTENITE_SVC_SERVICE_PORT  kubernetes `austenite-svc` service port  [ <port number> ]        • undefined",
        "  AUSTENITE_URL               example URL                              [ <URL> ]                • undefined",
        "❯ AUSTENITE_XTRIGGER          trigger failure                            <string>               ✗ undefined",
        "",
      ].join(EOL)
    );
    expect(exitCode).toBeGreaterThan(0);
  });

  it("summarizes variables with defaults", () => {
    string("AUSTENITE_XTRIGGER", "trigger failure");
    url("AUSTENITE_URL", "example URL", {
      default: new URL("https://default.example.org/path/to/resource"),
    });
    kubernetesAddress("austenite-svc", {
      default: {
        host: "host.example.org",
        port: 443,
      },
    });
    string("AUSTENITE_STRING", "example string", {
      default: "hello, world!",
    });
    number("AUSTENITE_NUMBER", "example number", {
      default: 123.456,
    });
    bigInteger("AUSTENITE_INTEGER_BIG", "example big integer", {
      default: 12345678901234567890n,
    });
    integer("AUSTENITE_INTEGER", "example integer", {
      default: 123456,
    });
    enumeration(
      "AUSTENITE_ENUMERATION",
      "example enumeration",
      {
        foo: {
          value: "foo",
          description: "foo",
        },
        bar: {
          value: "bar",
          description: "bar",
        },
        baz: {
          value: "baz",
          description: "baz",
        },
      } as const,
      {
        default: "bar",
      }
    );
    duration("AUSTENITE_DURATION", "example duration", {
      default: Duration.from("PT10S"),
    });
    boolean("AUSTENITE_BOOLEAN", "example boolean", {
      default: true,
      literals: {
        y: true,
        yes: true,
        n: false,
        no: false,
      },
    });

    initialize();

    expect(mockConsole.readStderr()).toBe(
      [
        "Environment Variables:",
        "",
        "  AUSTENITE_BOOLEAN           example boolean                          [ y | yes | n | no ] = y                                  ✓ using default value",
        "  AUSTENITE_DURATION          example duration                         [ <ISO 8601 duration> ] = PT10S                           ✓ using default value",
        "  AUSTENITE_ENUMERATION       example enumeration                      [ foo | bar | baz ] = bar                                 ✓ using default value",
        "  AUSTENITE_INTEGER           example integer                          [ <integer> ] = 123456                                    ✓ using default value",
        "  AUSTENITE_INTEGER_BIG       example big integer                      [ <integer> ] = 12345678901234567890                      ✓ using default value",
        "  AUSTENITE_NUMBER            example number                           [ <number> ] = 123.456                                    ✓ using default value",
        "  AUSTENITE_STRING            example string                           [ <string> ] = 'hello, world!'                            ✓ using default value",
        "  AUSTENITE_SVC_SERVICE_HOST  kubernetes `austenite-svc` service host  [ <hostname> ] = host.example.org                         ✓ using default value",
        "  AUSTENITE_SVC_SERVICE_PORT  kubernetes `austenite-svc` service port  [ <port number> ] = 443                                   ✓ using default value",
        "  AUSTENITE_URL               example URL                              [ <URL> ] = https://default.example.org/path/to/resource  ✓ using default value",
        "❯ AUSTENITE_XTRIGGER          trigger failure                            <string>                                                ✗ undefined",
        "",
      ].join(EOL)
    );
    expect(exitCode).toBeGreaterThan(0);
  });

  it("summarizes non-canonical values", () => {
    process.env.AUSTENITE_DURATION = "PT3H10M0S";
    process.env.AUSTENITE_INTEGER = "1.23456e5";
    process.env.AUSTENITE_INTEGER_BIG = "0x1E240";
    process.env.AUSTENITE_NUMBER = "1.23456e2";
    process.env.AUSTENITE_URL = "https://host.example.org";

    string("AUSTENITE_XTRIGGER", "trigger failure");
    url("AUSTENITE_URL", "example URL");
    number("AUSTENITE_NUMBER", "example number");
    bigInteger("AUSTENITE_INTEGER_BIG", "example big integer");
    integer("AUSTENITE_INTEGER", "example integer");
    duration("AUSTENITE_DURATION", "example duration");

    initialize();

    expect(mockConsole.readStderr()).toBe(
      [
        `Environment Variables:`,
        ``,
        "  AUSTENITE_DURATION     example duration       <ISO 8601 duration>    ✓ set to PT3H10M (specified non-canonically as PT3H10M0S)",
        "  AUSTENITE_INTEGER      example integer        <integer>              ✓ set to 123456 (specified non-canonically as 1.23456e5)",
        "  AUSTENITE_INTEGER_BIG  example big integer    <integer>              ✓ set to 123456 (specified non-canonically as 0x1E240)",
        "  AUSTENITE_NUMBER       example number         <number>               ✓ set to 123.456 (specified non-canonically as 1.23456e2)",
        "  AUSTENITE_URL          example URL            <URL>                  ✓ set to https://host.example.org/ (specified non-canonically as https://host.example.org)",
        `❯ AUSTENITE_XTRIGGER     trigger failure        <string>               ✗ undefined`,
        ``,
      ].join(EOL)
    );
    expect(exitCode).toBeGreaterThan(0);
  });

  it("summarizes invalid values", () => {
    process.env.AUSTENITE_BOOLEAN = "yes";
    process.env.AUSTENITE_DURATION = "10S";
    process.env.AUSTENITE_ENUMERATION = "qux";
    process.env.AUSTENITE_INTEGER = "123.456";
    process.env.AUSTENITE_INTEGER_BIG = "1.23456e5";
    process.env.AUSTENITE_NUMBER = "1.2.3";
    process.env.AUSTENITE_SVC_SERVICE_HOST = ".host.example.org";
    process.env.AUSTENITE_SVC_SERVICE_PORT = "65536";
    process.env.AUSTENITE_URL = "host.example.org";

    string("AUSTENITE_XTRIGGER", "trigger failure");
    url("AUSTENITE_URL", "example URL");
    kubernetesAddress("austenite-svc");
    // strings cannot really be "invalid" aside from being undefined
    string("AUSTENITE_STRING", "example string");
    number("AUSTENITE_NUMBER", "example number");
    bigInteger("AUSTENITE_INTEGER_BIG", "example big integer");
    integer("AUSTENITE_INTEGER", "example integer");
    enumeration("AUSTENITE_ENUMERATION", "example enumeration", {
      foo: {
        value: "foo",
        description: "foo",
      },
      bar: {
        value: "bar",
        description: "bar",
      },
      baz: {
        value: "baz",
        description: "baz",
      },
    });
    duration("AUSTENITE_DURATION", "example duration");
    boolean("AUSTENITE_BOOLEAN", "example boolean");

    initialize();

    expect(mockConsole.readStderr()).toBe(
      [
        `Environment Variables:`,
        ``,
        `❯ AUSTENITE_BOOLEAN           example boolean                            true | false           ✗ set to yes, expected true or false`,
        "❯ AUSTENITE_DURATION          example duration                           <ISO 8601 duration>    ✗ set to 10S, must be an ISO 8601 duration",
        "❯ AUSTENITE_ENUMERATION       example enumeration                        foo | bar | baz        ✗ set to qux, expected foo, bar, or baz",
        "❯ AUSTENITE_INTEGER           example integer                            <integer>              ✗ set to 123.456, must be an integer",
        "❯ AUSTENITE_INTEGER_BIG       example big integer                        <integer>              ✗ set to 1.23456e5, must be a big integer",
        "❯ AUSTENITE_NUMBER            example number                             <number>               ✗ set to 1.2.3, must be numeric",
        `❯ AUSTENITE_STRING            example string                             <string>               ✗ undefined`,
        "❯ AUSTENITE_SVC_SERVICE_HOST  kubernetes `austenite-svc` service host    <hostname>             ✗ set to .host.example.org, must not begin or end with a dot",
        "❯ AUSTENITE_SVC_SERVICE_PORT  kubernetes `austenite-svc` service port    <port number>          ✗ set to 65536, must be between 1 and 65535",
        "❯ AUSTENITE_URL               example URL                                <URL>                  ✗ set to host.example.org, must be a URL",
        `❯ AUSTENITE_XTRIGGER          trigger failure                            <string>               ✗ undefined`,
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
      schema: createString("string"),
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
