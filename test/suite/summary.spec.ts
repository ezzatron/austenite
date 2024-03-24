import { Temporal } from "@js-temporal/polyfill";
import { join } from "path";
import { fileURLToPath } from "url";
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
import { MockConsole, createMockConsole } from "../helpers.js";

const fixturesPath = fileURLToPath(
  new URL("../fixture/summary", import.meta.url),
);

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

  it("summarizes required variables", async () => {
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

    await expect(mockConsole.readStderr()).toMatchFileSnapshot(
      fixturePath("required"),
    );
    expect(exitCode).toBeGreaterThan(0);
  });

  it("summarizes optional variables with no defaults", async () => {
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

    await expect(mockConsole.readStderr()).toMatchFileSnapshot(
      fixturePath("optional"),
    );
    expect(exitCode).toBeGreaterThan(0);
  });

  it("summarizes variables with defaults", async () => {
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

    await expect(mockConsole.readStderr()).toMatchFileSnapshot(
      fixturePath("default"),
    );
    expect(exitCode).toBeGreaterThan(0);
  });

  it("summarizes non-canonical values", async () => {
    Object.assign(process.env, {
      AUSTENITE_BINARY: "QmVlcCBib29wIQ",
      AUSTENITE_DURATION: "PT3H10M0S",
      AUSTENITE_INTEGER_BIG: "0x1e240",
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

    await expect(mockConsole.readStderr()).toMatchFileSnapshot(
      fixturePath("non-canonical"),
    );
    expect(exitCode).toBeGreaterThan(0);
  });

  it("summarizes invalid values", async () => {
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

    await expect(mockConsole.readStderr()).toMatchFileSnapshot(
      fixturePath("invalid"),
    );
    expect(exitCode).toBeGreaterThan(0);
  });

  it("summarizes variables that violate constraints", async () => {
    Object.assign(process.env, {
      AUSTENITE_STRING: "hello, world!",
      AUSTENITE_BINARY: "QmVlcCBib29wIQ==",
      AUSTENITE_NUMBER: "3.2",
      AUSTENITE_INTEGER: "2",
      AUSTENITE_INTEGER_BIG: "2",
      AUSTENITE_PORT_NUMBER: "22222",
      AUSTENITE_DURATION: "PT2S",
      AUSTENITE_CUSTOM: "Goodbye, loser!",
    });

    string("AUSTENITE_XTRIGGER", "trigger failure");
    string("AUSTENITE_STRING", "example string", {
      length: 5,
      examples: [{ value: "abcde", label: "example" }],
    });
    binary("AUSTENITE_BINARY", "example binary", {
      length: 5,
      examples: [{ value: Buffer.from("abcde", "utf-8"), label: "example" }],
    });
    number("AUSTENITE_NUMBER", "example number", {
      min: 3.3,
      examples: [{ value: 3.3, label: "example" }],
    });
    integer("AUSTENITE_INTEGER", "example integer", {
      min: 3,
      examples: [{ value: 3, label: "example" }],
    });
    bigInteger("AUSTENITE_INTEGER_BIG", "example big integer", {
      min: 3n,
      examples: [{ value: 3n, label: "example" }],
    });
    networkPortNumber("AUSTENITE_PORT_NUMBER", "example port number", {
      min: 33333,
      examples: [{ value: 33333, label: "example" }],
    });
    duration("AUSTENITE_DURATION", "example duration", {
      min: Duration.from("PT3S"),
      examples: [{ value: Duration.from("PT3S"), label: "example" }],
    });
    registerVariable({
      name: "AUSTENITE_CUSTOM",
      description: "custom variable",
      default: undefinedValue(),
      isSensitive: false,
      schema: createString("string", [
        {
          description: "must start with a greeting",
          constrain: function constrainGreeting(v) {
            if (!v.match(/^(Hi|Hello)\b/)) {
              return 'must start with "Hi" or "Hello"';
            }
          },
        },
        {
          description: "must end with a subject",
          constrain: function constrainSubject(v) {
            if (!v.match(/\b(world|universe)!$/i)) {
              return 'must end with "world!" or "universe!"';
            }
          },
        },
      ]),
      examples: [{ value: "Hello, world!", label: "example" }],
    });

    initialize();

    await expect(mockConsole.readStderr()).toMatchFileSnapshot(
      fixturePath("constraint-violation"),
    );
    expect(exitCode).toBeGreaterThan(0);
  });

  it("summarizes sensitive variables", async () => {
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

    await expect(mockConsole.readStderr()).toMatchFileSnapshot(
      fixturePath("sensitive"),
    );
    expect(exitCode).toBeGreaterThan(0);
  });

  it("summarizes sensitive variables with defaults", async () => {
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

    await expect(mockConsole.readStderr()).toMatchFileSnapshot(
      fixturePath("sensitive-default"),
    );
    expect(exitCode).toBeGreaterThan(0);
  });

  it("summarizes sensitive non-canonical values", async () => {
    process.env.AUSTENITE_BINARY = "QmVlcCBib29wIQ";

    string("AUSTENITE_XTRIGGER", "trigger failure");
    binary("AUSTENITE_BINARY", "example binary", {
      isSensitive: true,
    });

    initialize();

    await expect(mockConsole.readStderr()).toMatchFileSnapshot(
      fixturePath("sensitive-non-canonical"),
    );
    expect(exitCode).toBeGreaterThan(0);
  });

  it("summarizes sensitive invalid values", async () => {
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

    await expect(mockConsole.readStderr()).toMatchFileSnapshot(
      fixturePath("senstive-invalid"),
    );
    expect(exitCode).toBeGreaterThan(0);
  });
});

function fixturePath(name: string): string {
  return join(fixturesPath, `${name}.ansi`);
}
