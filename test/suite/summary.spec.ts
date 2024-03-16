import { Temporal } from "@js-temporal/polyfill";
import { EOL } from "os";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { registerVariable } from "../../src/environment.js";
import {
  bigInteger,
  binary,
  boolean,
  duration,
  enumeration,
  initialize,
  integer,
  kubernetesAddress,
  networkPortNumber,
  number,
  string,
  url,
} from "../../src/index.js";
import { undefinedValue } from "../../src/maybe.js";
import { createString } from "../../src/schema.js";
import { VariableSpec } from "../../src/variable.js";
import { MockConsole, createMockConsole } from "../helpers.js";

const { Duration } = Temporal;

describe("Validation summary", () => {
  let exitCode: number | undefined;
  let mockConsole: MockConsole;

  beforeEach(() => {
    exitCode = undefined;
    vi.spyOn(process, "exit").mockImplementation((code) => {
      exitCode = code ?? 0;

      return undefined as never;
    });

    mockConsole = createMockConsole();
  });

  it("summarizes required variables", () => {
    Object.assign(process.env, {
      AUSTENITE_BINARY: "QmVlcCBib29wIQ==",
      AUSTENITE_BOOLEAN: "y",
      AUSTENITE_DURATION: "PT3H20M",
      AUSTENITE_ENUMERATION: "foo",
      AUSTENITE_INTEGER_BIG: "-12345678901234567890",
      AUSTENITE_INTEGER: "-123456",
      AUSTENITE_NUMBER: "-123.456",
      AUSTENITE_PORT_NUMBER: "443",
      AUSTENITE_STRING: "Season's greetings, world!",
      AUSTENITE_SVC_SERVICE_HOST: "host.example.org",
      AUSTENITE_SVC_SERVICE_PORT: "443",
      AUSTENITE_URL: "https://host.example.org/path/to/resource",
    });

    string("AUSTENITE_XTRIGGER", "trigger failure");
    url("AUSTENITE_URL", "example URL");
    kubernetesAddress("austenite-svc");
    string("AUSTENITE_STRING", "example string");
    networkPortNumber("AUSTENITE_PORT_NUMBER", "example port number");
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
    binary("AUSTENITE_BINARY", "example binary");

    initialize();

    expect(mockConsole.readStderr()).toBe(
      [
        "Environment Variables:",
        "",
        "  AUSTENITE_BINARY            example binary                             <base64>               ✓ set to QmVlcCBib29wIQ==",
        "  AUSTENITE_BOOLEAN           example boolean                            y | yes | n | no       ✓ set to y",
        "  AUSTENITE_DURATION          example duration                           <ISO 8601 duration>    ✓ set to PT3H20M",
        "  AUSTENITE_ENUMERATION       example enumeration                        foo | bar | baz        ✓ set to foo",
        "  AUSTENITE_INTEGER           example integer                            <integer>              ✓ set to -123456",
        "  AUSTENITE_INTEGER_BIG       example big integer                        <big integer>          ✓ set to -12345678901234567890",
        "  AUSTENITE_NUMBER            example number                             <number>               ✓ set to -123.456",
        "  AUSTENITE_PORT_NUMBER       example port number                        <port number>          ✓ set to 443",
        `  AUSTENITE_STRING            example string                             <string>               ✓ set to 'Season'"'"'s greetings, world!'`,
        "  AUSTENITE_SVC_SERVICE_HOST  kubernetes `austenite-svc` service host    <hostname>             ✓ set to host.example.org",
        "  AUSTENITE_SVC_SERVICE_PORT  kubernetes `austenite-svc` service port    <port number>          ✓ set to 443",
        "  AUSTENITE_URL               example URL                                <URL>                  ✓ set to https://host.example.org/path/to/resource",
        "❯ AUSTENITE_XTRIGGER          trigger failure                            <string>               ✗ undefined",
        "",
      ].join(EOL),
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
    networkPortNumber("AUSTENITE_PORT_NUMBER", "example port number", {
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
      },
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
    binary("AUSTENITE_BINARY", "example binary", {
      default: undefined,
    });

    initialize();

    expect(mockConsole.readStderr()).toBe(
      [
        "Environment Variables:",
        "",
        "  AUSTENITE_BINARY            example binary                           [ <base64> ]             • undefined",
        "  AUSTENITE_BOOLEAN           example boolean                          [ y | yes | n | no ]     • undefined",
        "  AUSTENITE_DURATION          example duration                         [ <ISO 8601 duration> ]  • undefined",
        "  AUSTENITE_ENUMERATION       example enumeration                      [ foo | bar | baz ]      • undefined",
        "  AUSTENITE_INTEGER           example integer                          [ <integer> ]            • undefined",
        "  AUSTENITE_INTEGER_BIG       example big integer                      [ <big integer> ]        • undefined",
        "  AUSTENITE_NUMBER            example number                           [ <number> ]             • undefined",
        "  AUSTENITE_PORT_NUMBER       example port number                      [ <port number> ]        • undefined",
        "  AUSTENITE_STRING            example string                           [ <string> ]             • undefined",
        "  AUSTENITE_SVC_SERVICE_HOST  kubernetes `austenite-svc` service host  [ <hostname> ]           • undefined",
        "  AUSTENITE_SVC_SERVICE_PORT  kubernetes `austenite-svc` service port  [ <port number> ]        • undefined",
        "  AUSTENITE_URL               example URL                              [ <URL> ]                • undefined",
        "❯ AUSTENITE_XTRIGGER          trigger failure                            <string>               ✗ undefined",
        "",
      ].join(EOL),
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
    networkPortNumber("AUSTENITE_PORT_NUMBER", "example port number", {
      default: 443,
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
      },
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
    binary("AUSTENITE_BINARY", "example binary", {
      default: Buffer.from("Beep boop!", "utf-8"),
    });

    initialize();

    expect(mockConsole.readStderr()).toBe(
      [
        "Environment Variables:",
        "",
        "  AUSTENITE_BINARY            example binary                           [ <base64> ] = QmVlcCBib29wIQ==                           ✓ using default value",
        "  AUSTENITE_BOOLEAN           example boolean                          [ y | yes | n | no ] = y                                  ✓ using default value",
        "  AUSTENITE_DURATION          example duration                         [ <ISO 8601 duration> ] = PT10S                           ✓ using default value",
        "  AUSTENITE_ENUMERATION       example enumeration                      [ foo | bar | baz ] = bar                                 ✓ using default value",
        "  AUSTENITE_INTEGER           example integer                          [ <integer> ] = 123456                                    ✓ using default value",
        "  AUSTENITE_INTEGER_BIG       example big integer                      [ <big integer> ] = 12345678901234567890                  ✓ using default value",
        "  AUSTENITE_NUMBER            example number                           [ <number> ] = 123.456                                    ✓ using default value",
        "  AUSTENITE_PORT_NUMBER       example port number                      [ <port number> ] = 443                                   ✓ using default value",
        "  AUSTENITE_STRING            example string                           [ <string> ] = 'hello, world!'                            ✓ using default value",
        "  AUSTENITE_SVC_SERVICE_HOST  kubernetes `austenite-svc` service host  [ <hostname> ] = host.example.org                         ✓ using default value",
        "  AUSTENITE_SVC_SERVICE_PORT  kubernetes `austenite-svc` service port  [ <port number> ] = 443                                   ✓ using default value",
        "  AUSTENITE_URL               example URL                              [ <URL> ] = https://default.example.org/path/to/resource  ✓ using default value",
        "❯ AUSTENITE_XTRIGGER          trigger failure                            <string>                                                ✗ undefined",
        "",
      ].join(EOL),
    );
    expect(exitCode).toBeGreaterThan(0);
  });

  it("summarizes non-canonical values", () => {
    Object.assign(process.env, {
      AUSTENITE_BINARY: "QmVlcCBib29wIQ",
      AUSTENITE_DURATION: "PT3H10M0S",
      AUSTENITE_INTEGER_BIG: "0x1E240",
      AUSTENITE_INTEGER: "1.23456e5",
      AUSTENITE_NUMBER: "1.23456e2",
      AUSTENITE_URL: "https://host.example.org",
    });

    string("AUSTENITE_XTRIGGER", "trigger failure");
    url("AUSTENITE_URL", "example URL");
    number("AUSTENITE_NUMBER", "example number");
    bigInteger("AUSTENITE_INTEGER_BIG", "example big integer");
    integer("AUSTENITE_INTEGER", "example integer");
    duration("AUSTENITE_DURATION", "example duration");
    binary("AUSTENITE_BINARY", "example binary");

    initialize();

    expect(mockConsole.readStderr()).toBe(
      [
        `Environment Variables:`,
        ``,
        "  AUSTENITE_BINARY       example binary         <base64>               ✓ set to QmVlcCBib29wIQ== (specified non-canonically as QmVlcCBib29wIQ)",
        "  AUSTENITE_DURATION     example duration       <ISO 8601 duration>    ✓ set to PT3H10M (specified non-canonically as PT3H10M0S)",
        "  AUSTENITE_INTEGER      example integer        <integer>              ✓ set to 123456 (specified non-canonically as 1.23456e5)",
        "  AUSTENITE_INTEGER_BIG  example big integer    <big integer>          ✓ set to 123456 (specified non-canonically as 0x1E240)",
        "  AUSTENITE_NUMBER       example number         <number>               ✓ set to 123.456 (specified non-canonically as 1.23456e2)",
        "  AUSTENITE_URL          example URL            <URL>                  ✓ set to https://host.example.org/ (specified non-canonically as https://host.example.org)",
        `❯ AUSTENITE_XTRIGGER     trigger failure        <string>               ✗ undefined`,
        ``,
      ].join(EOL),
    );
    expect(exitCode).toBeGreaterThan(0);
  });

  it("summarizes invalid values", () => {
    Object.assign(process.env, {
      AUSTENITE_BINARY: "???",
      AUSTENITE_BOOLEAN: "yes",
      AUSTENITE_DURATION: "10S",
      AUSTENITE_ENUMERATION: "qux",
      AUSTENITE_INTEGER_BIG: "1.23456e5",
      AUSTENITE_INTEGER: "123.456",
      AUSTENITE_NUMBER: "1.2.3",
      AUSTENITE_PORT_NUMBER: "65536",
      AUSTENITE_SVC_SERVICE_HOST: ".host.example.org",
      AUSTENITE_SVC_SERVICE_PORT: "65536",
      AUSTENITE_URL: "host.example.org",
    });

    string("AUSTENITE_XTRIGGER", "trigger failure");
    url("AUSTENITE_URL", "example URL");
    kubernetesAddress("austenite-svc");
    // strings cannot really be "invalid" aside from being undefined
    string("AUSTENITE_STRING", "example string");
    networkPortNumber("AUSTENITE_PORT_NUMBER", "example port number");
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
    binary("AUSTENITE_BINARY", "example binary");

    initialize();

    expect(mockConsole.readStderr()).toBe(
      [
        `Environment Variables:`,
        ``,
        `❯ AUSTENITE_BINARY            example binary                             <base64>               ✗ set to '???', must be base64 encoded`,
        `❯ AUSTENITE_BOOLEAN           example boolean                            true | false           ✗ set to yes, expected true or false`,
        "❯ AUSTENITE_DURATION          example duration                           <ISO 8601 duration>    ✗ set to 10S, must be an ISO 8601 duration",
        "❯ AUSTENITE_ENUMERATION       example enumeration                        foo | bar | baz        ✗ set to qux, expected foo, bar, or baz",
        "❯ AUSTENITE_INTEGER           example integer                            <integer>              ✗ set to 123.456, must be an integer",
        "❯ AUSTENITE_INTEGER_BIG       example big integer                        <big integer>          ✗ set to 1.23456e5, must be a big integer",
        "❯ AUSTENITE_NUMBER            example number                             <number>               ✗ set to 1.2.3, must be numeric",
        "❯ AUSTENITE_PORT_NUMBER       example port number                        <port number>          ✗ set to 65536, must be between 1 and 65535",
        `❯ AUSTENITE_STRING            example string                             <string>               ✗ undefined`,
        "❯ AUSTENITE_SVC_SERVICE_HOST  kubernetes `austenite-svc` service host    <hostname>             ✗ set to .host.example.org, must not begin or end with a dot",
        "❯ AUSTENITE_SVC_SERVICE_PORT  kubernetes `austenite-svc` service port    <port number>          ✗ set to 65536, must be between 1 and 65535",
        "❯ AUSTENITE_URL               example URL                                <URL>                  ✗ set to host.example.org, must be a URL",
        `❯ AUSTENITE_XTRIGGER          trigger failure                            <string>               ✗ undefined`,
        ``,
      ].join(EOL),
    );
    expect(exitCode).toBeGreaterThan(0);
  });

  it("summarizes sensitive variables", () => {
    Object.assign(process.env, {
      AUSTENITE_BINARY: "QmVlcCBib29wIQ==",
      AUSTENITE_BOOLEAN: "y",
      AUSTENITE_DURATION: "PT3H20M",
      AUSTENITE_ENUMERATION: "foo",
      AUSTENITE_INTEGER_BIG: "-12345678901234567890",
      AUSTENITE_INTEGER: "-123456",
      AUSTENITE_NUMBER: "-123.456",
      AUSTENITE_PORT_NUMBER: "443",
      AUSTENITE_STRING: "Season's greetings, world!",
      AUSTENITE_SVC_SERVICE_HOST: "host.example.org",
      AUSTENITE_SVC_SERVICE_PORT: "443",
      AUSTENITE_URL: "https://host.example.org/path/to/resource",
    });

    string("AUSTENITE_XTRIGGER", "trigger failure", {
      isSensitive: true,
    });
    url("AUSTENITE_URL", "example URL", {
      isSensitive: true,
    });
    kubernetesAddress("austenite-svc", {
      isSensitive: true,
    });
    string("AUSTENITE_STRING", "example string", {
      isSensitive: true,
    });
    networkPortNumber("AUSTENITE_PORT_NUMBER", "example port number", {
      isSensitive: true,
    });
    number("AUSTENITE_NUMBER", "example number", {
      isSensitive: true,
    });
    bigInteger("AUSTENITE_INTEGER_BIG", "example big integer", {
      isSensitive: true,
    });
    integer("AUSTENITE_INTEGER", "example integer", {
      isSensitive: true,
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
        isSensitive: true,
      },
    );
    duration("AUSTENITE_DURATION", "example duration", {
      isSensitive: true,
    });
    boolean("AUSTENITE_BOOLEAN", "example boolean", {
      isSensitive: true,
      literals: {
        y: true,
        yes: true,
        n: false,
        no: false,
      },
    });
    binary("AUSTENITE_BINARY", "example binary", {
      isSensitive: true,
    });

    initialize();

    expect(mockConsole.readStderr()).toBe(
      [
        "Environment Variables:",
        "",
        "  AUSTENITE_BINARY            example binary                             <base64>               ✓ set to <sensitive value>",
        "  AUSTENITE_BOOLEAN           example boolean                            y | yes | n | no       ✓ set to <sensitive value>",
        "  AUSTENITE_DURATION          example duration                           <ISO 8601 duration>    ✓ set to <sensitive value>",
        "  AUSTENITE_ENUMERATION       example enumeration                        foo | bar | baz        ✓ set to <sensitive value>",
        "  AUSTENITE_INTEGER           example integer                            <integer>              ✓ set to <sensitive value>",
        "  AUSTENITE_INTEGER_BIG       example big integer                        <big integer>          ✓ set to <sensitive value>",
        "  AUSTENITE_NUMBER            example number                             <number>               ✓ set to <sensitive value>",
        "  AUSTENITE_PORT_NUMBER       example port number                        <port number>          ✓ set to <sensitive value>",
        `  AUSTENITE_STRING            example string                             <string>               ✓ set to <sensitive value>`,
        "  AUSTENITE_SVC_SERVICE_HOST  kubernetes `austenite-svc` service host    <hostname>             ✓ set to <sensitive value>",
        "  AUSTENITE_SVC_SERVICE_PORT  kubernetes `austenite-svc` service port    <port number>          ✓ set to <sensitive value>",
        "  AUSTENITE_URL               example URL                                <URL>                  ✓ set to <sensitive value>",
        "❯ AUSTENITE_XTRIGGER          trigger failure                            <string>               ✗ undefined",
        "",
      ].join(EOL),
    );
    expect(exitCode).toBeGreaterThan(0);
  });

  it("summarizes sensitive variables with defaults", () => {
    string("AUSTENITE_XTRIGGER", "trigger failure");
    url("AUSTENITE_URL", "example URL", {
      default: new URL("https://default.example.org/path/to/resource"),
      isSensitive: true,
    });
    kubernetesAddress("austenite-svc", {
      default: {
        host: "host.example.org",
        port: 443,
      },
      isSensitive: true,
    });
    string("AUSTENITE_STRING", "example string", {
      default: "hello, world!",
      isSensitive: true,
    });
    networkPortNumber("AUSTENITE_PORT_NUMBER", "example port number", {
      default: 443,
      isSensitive: true,
    });
    number("AUSTENITE_NUMBER", "example number", {
      default: 123.456,
      isSensitive: true,
    });
    bigInteger("AUSTENITE_INTEGER_BIG", "example big integer", {
      default: 12345678901234567890n,
      isSensitive: true,
    });
    integer("AUSTENITE_INTEGER", "example integer", {
      default: 123456,
      isSensitive: true,
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
        isSensitive: true,
      },
    );
    duration("AUSTENITE_DURATION", "example duration", {
      default: Duration.from("PT10S"),
      isSensitive: true,
    });
    boolean("AUSTENITE_BOOLEAN", "example boolean", {
      default: true,
      isSensitive: true,
      literals: {
        y: true,
        yes: true,
        n: false,
        no: false,
      },
    });
    binary("AUSTENITE_BINARY", "example binary", {
      isSensitive: true,
      default: Buffer.from("Beep boop!", "utf-8"),
    });

    initialize();

    expect(mockConsole.readStderr()).toBe(
      [
        "Environment Variables:",
        "",
        "  AUSTENITE_BINARY            example binary                           [ <base64> ] = <sensitive value>             ✓ using default value",
        "  AUSTENITE_BOOLEAN           example boolean                          [ y | yes | n | no ] = <sensitive value>     ✓ using default value",
        "  AUSTENITE_DURATION          example duration                         [ <ISO 8601 duration> ] = <sensitive value>  ✓ using default value",
        "  AUSTENITE_ENUMERATION       example enumeration                      [ foo | bar | baz ] = <sensitive value>      ✓ using default value",
        "  AUSTENITE_INTEGER           example integer                          [ <integer> ] = <sensitive value>            ✓ using default value",
        "  AUSTENITE_INTEGER_BIG       example big integer                      [ <big integer> ] = <sensitive value>        ✓ using default value",
        "  AUSTENITE_NUMBER            example number                           [ <number> ] = <sensitive value>             ✓ using default value",
        "  AUSTENITE_PORT_NUMBER       example port number                      [ <port number> ] = <sensitive value>        ✓ using default value",
        "  AUSTENITE_STRING            example string                           [ <string> ] = <sensitive value>             ✓ using default value",
        "  AUSTENITE_SVC_SERVICE_HOST  kubernetes `austenite-svc` service host  [ <hostname> ] = <sensitive value>           ✓ using default value",
        "  AUSTENITE_SVC_SERVICE_PORT  kubernetes `austenite-svc` service port  [ <port number> ] = <sensitive value>        ✓ using default value",
        "  AUSTENITE_URL               example URL                              [ <URL> ] = <sensitive value>                ✓ using default value",
        "❯ AUSTENITE_XTRIGGER          trigger failure                            <string>                                   ✗ undefined",
        "",
      ].join(EOL),
    );
    expect(exitCode).toBeGreaterThan(0);
  });

  it("summarizes sensitive non-canonical values", () => {
    process.env.AUSTENITE_BINARY = "QmVlcCBib29wIQ";

    string("AUSTENITE_XTRIGGER", "trigger failure");
    binary("AUSTENITE_BINARY", "example binary", {
      isSensitive: true,
    });

    initialize();

    expect(mockConsole.readStderr()).toBe(
      [
        `Environment Variables:`,
        ``,
        "  AUSTENITE_BINARY    example binary     <base64>    ✓ set to <sensitive value> (specified non-canonically)",
        `❯ AUSTENITE_XTRIGGER  trigger failure    <string>    ✗ undefined`,
        ``,
      ].join(EOL),
    );
    expect(exitCode).toBeGreaterThan(0);
  });

  it("summarizes sensitive invalid values", () => {
    Object.assign(process.env, {
      AUSTENITE_BINARY: "???",
      AUSTENITE_BOOLEAN: "yes",
      AUSTENITE_DURATION: "10S",
      AUSTENITE_ENUMERATION: "qux",
      AUSTENITE_INTEGER_BIG: "1.23456e5",
      AUSTENITE_INTEGER: "123.456",
      AUSTENITE_NUMBER: "1.2.3",
      AUSTENITE_PORT_NUMBER: "65536",
      AUSTENITE_SVC_SERVICE_HOST: ".host.example.org",
      AUSTENITE_SVC_SERVICE_PORT: "65536",
      AUSTENITE_URL: "host.example.org",
    });

    string("AUSTENITE_XTRIGGER", "trigger failure", {
      isSensitive: true,
    });
    url("AUSTENITE_URL", "example URL", {
      isSensitive: true,
    });
    kubernetesAddress("austenite-svc", {
      isSensitive: true,
    });
    networkPortNumber("AUSTENITE_PORT_NUMBER", "example port number", {
      isSensitive: true,
    });
    number("AUSTENITE_NUMBER", "example number", {
      isSensitive: true,
    });
    bigInteger("AUSTENITE_INTEGER_BIG", "example big integer", {
      isSensitive: true,
    });
    integer("AUSTENITE_INTEGER", "example integer", {
      isSensitive: true,
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
        isSensitive: true,
      },
    );
    duration("AUSTENITE_DURATION", "example duration", {
      isSensitive: true,
    });
    boolean("AUSTENITE_BOOLEAN", "example boolean", {
      isSensitive: true,
    });
    binary("AUSTENITE_BINARY", "example binary", {
      isSensitive: true,
    });

    initialize();

    expect(mockConsole.readStderr()).toBe(
      [
        `Environment Variables:`,
        ``,
        `❯ AUSTENITE_BINARY            example binary                             <base64>               ✗ set to <sensitive value>, must be base64 encoded`,
        `❯ AUSTENITE_BOOLEAN           example boolean                            true | false           ✗ set to <sensitive value>, expected true or false`,
        "❯ AUSTENITE_DURATION          example duration                           <ISO 8601 duration>    ✗ set to <sensitive value>, must be an ISO 8601 duration",
        "❯ AUSTENITE_ENUMERATION       example enumeration                        foo | bar | baz        ✗ set to <sensitive value>, expected foo, bar, or baz",
        "❯ AUSTENITE_INTEGER           example integer                            <integer>              ✗ set to <sensitive value>, must be an integer",
        "❯ AUSTENITE_INTEGER_BIG       example big integer                        <big integer>          ✗ set to <sensitive value>, must be a big integer",
        "❯ AUSTENITE_NUMBER            example number                             <number>               ✗ set to <sensitive value>, must be numeric",
        "❯ AUSTENITE_PORT_NUMBER       example port number                        <port number>          ✗ set to <sensitive value>, must be between 1 and 65535",
        "❯ AUSTENITE_SVC_SERVICE_HOST  kubernetes `austenite-svc` service host    <hostname>             ✗ set to <sensitive value>, must not begin or end with a dot",
        "❯ AUSTENITE_SVC_SERVICE_PORT  kubernetes `austenite-svc` service port    <port number>          ✗ set to <sensitive value>, must be between 1 and 65535",
        "❯ AUSTENITE_URL               example URL                                <URL>                  ✗ set to <sensitive value>, must be a URL",
        `❯ AUSTENITE_XTRIGGER          trigger failure                            <string>               ✗ undefined`,
        ``,
      ].join(EOL),
    );
    expect(exitCode).toBeGreaterThan(0);
  });

  it("summarizes misbehaving variables", () => {
    Object.assign(process.env, {
      AUSTENITE_CUSTOM: "custom value",
      AUSTENITE_STRING: "hello, world!",
    });

    const spec: VariableSpec<string> = {
      name: "AUSTENITE_CUSTOM",
      description: "custom variable",
      default: undefinedValue(),
      isSensitive: false,
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
      ].join(EOL),
    );
    expect(exitCode).toBeGreaterThan(0);
  });
});
