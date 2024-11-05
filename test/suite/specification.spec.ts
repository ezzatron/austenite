import { Temporal } from "@js-temporal/polyfill";
import {
  bigInteger,
  binary,
  boolean,
  duration,
  enumeration,
  integer,
  kubernetesAddress,
  networkPortNumber,
  number,
  string,
  url,
} from "austenite";
import { initialize } from "austenite/node";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MockConsole, createMockConsole } from "../helpers.js";

const fixturesPath = fileURLToPath(
  new URL("../fixture/specification", import.meta.url),
);

const { Duration } = Temporal;

describe("Specification documents", () => {
  let exitCode: number | undefined;
  let mockConsole: MockConsole;

  beforeEach(() => {
    exitCode = undefined;
    vi.spyOn(process, "exit").mockImplementation((code) => {
      exitCode = (code ?? 0) as number;

      return undefined as never;
    });

    process.env = {
      AUSTENITE_SPEC: "true",
    };

    mockConsole = createMockConsole();
  });

  describe("when there are big integers", () => {
    it("describes required big integers", async () => {
      bigInteger("WEIGHT", "weighting for this node");
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("big-integer/required"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional big integers", async () => {
      bigInteger("WEIGHT", "weighting for this node", {
        default: undefined,
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("big-integer/optional"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional big integers with defaults", async () => {
      bigInteger("WEIGHT", "weighting for this node", {
        default: 10000000000000001n,
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("big-integer/default"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes big integers with examples", async () => {
      bigInteger("WEIGHT", "weighting for this node", {
        examples: [
          { value: 5_000_000_000_000_000_000_000_000n, label: "5 septillion" },
          {
            value: 6_000_000_000_000_000_000_000_000n,
            as: "0x4f68ca6d8cd91c6000000",
            label: "6 septillion",
          },
        ],
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("big-integer/examples"),
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are binaries", () => {
    it("describes required binaries", async () => {
      binary("SESSION_KEY", "session token signing key");
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("binary/required"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional binaries", async () => {
      binary("SESSION_KEY", "session token signing key", {
        default: undefined,
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("binary/optional"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional binaries with defaults", async () => {
      binary("SESSION_KEY", "session token signing key", {
        default: Buffer.from(
          "XY7l3m0bmuzX5IAu6/KUyPRQXKc8H1LjAl2Q897vbYw=",
          "base64",
        ),
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("binary/default"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes binaries with examples", async () => {
      binary("SESSION_KEY", "session token signing key", {
        examples: [
          {
            value: Buffer.from("128_BIT_SIGN_KEY", "utf-8"),
            label: "128-bit key",
          },
          {
            value: Buffer.from("SUPER_SECRET_256_BIT_SIGNING_KEY", "utf-8"),
            as: "U1VQRVJfU0VDUkVUXzI1Nl9CSVRfU0lHTklOR19LRVk",
            label: "256-bit key",
          },
        ],
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("binary/examples"),
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are booleans", () => {
    it("describes required booleans", async () => {
      boolean("DEBUG", "enable or disable debugging features");
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("boolean/required"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional booleans", async () => {
      boolean("DEBUG", "enable or disable debugging features", {
        default: undefined,
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("boolean/optional"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional booleans with defaults", async () => {
      boolean("DEBUG", "enable or disable debugging features", {
        default: false,
      });
      boolean("PRODUCTION", "enable or disable production mode", {
        default: true,
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("boolean/default"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes booleans with custom literals", async () => {
      boolean("DEBUG", "enable or disable debugging features", {
        default: false,
        literals: {
          y: true,
          yes: true,
          n: false,
          no: false,
        },
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("boolean/custom-literals"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes booleans with examples", async () => {
      boolean("DEBUG", "enable or disable debugging features", {
        literals: { y: true, yes: true, n: false, no: false },
        examples: [
          { value: true, label: "enabled" },
          { value: false, as: "no", label: "disabled" },
        ],
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("boolean/examples"),
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are durations", () => {
    it("describes required durations", async () => {
      duration("GRPC_TIMEOUT", "gRPC request timeout");
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("duration/required"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional durations", async () => {
      duration("GRPC_TIMEOUT", "gRPC request timeout", {
        default: undefined,
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("duration/optional"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional durations with defaults", async () => {
      duration("GRPC_TIMEOUT", "gRPC request timeout", {
        default: Duration.from("PT0.01S"),
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("duration/default"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes durations with examples", async () => {
      duration("GRPC_TIMEOUT", "gRPC request timeout", {
        examples: [
          {
            value: Temporal.Duration.from({ milliseconds: 100 }),
            label: "100 milliseconds",
          },
          {
            value: Temporal.Duration.from({ seconds: 5 }),
            as: "P0DT5S",
            label: "5 seconds",
          },
        ],
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("duration/examples"),
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are enumerations", () => {
    const members = {
      debug: { value: "debug", description: "show information for developers" },
      info: { value: "info", description: "standard log messages" },
      warn: {
        value: "warn",
        description: "important, but don't need individual human review",
      },
      error: {
        value: "error",
        description: "a healthy application shouldn't produce any errors",
      },
      fatal: { value: "fatal", description: "the application cannot proceed" },
    } as const;

    it("describes required enumerations", async () => {
      enumeration("LOG_LEVEL", "the minimum log level to record", members);
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("enumeration/required"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional enumerations", async () => {
      enumeration("LOG_LEVEL", "the minimum log level to record", members, {
        default: undefined,
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("enumeration/optional"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional enumerations with defaults", async () => {
      enumeration("LOG_LEVEL", "the minimum log level to record", members, {
        default: "error",
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("enumeration/default"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes enumerations with examples", async () => {
      enumeration("LOG_LEVEL", "the minimum log level to record", members, {
        examples: [
          { value: "debug", label: "if you want lots of output" },
          {
            value: "error",
            label: "if you only want to see when things go wrong",
          },
        ],
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("enumeration/examples"),
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are integers", () => {
    it("describes required integers", async () => {
      integer("WEIGHT", "weighting for this node");
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("integer/required"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional integers", async () => {
      integer("WEIGHT", "weighting for this node", {
        default: undefined,
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("integer/optional"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional integers with defaults", async () => {
      integer("WEIGHT", "weighting for this node", {
        default: 101,
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("integer/default"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes integers with examples", async () => {
      integer("WEIGHT", "weighting for this node", {
        examples: [
          { value: 1, label: "lowest weight" },
          { value: 1000, as: "1e3", label: "highest weight" },
        ],
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("integer/examples"),
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are kubernetes addresses", () => {
    it("describes required addresses", async () => {
      kubernetesAddress("redis-primary");
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("kubernetes-address/required"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional addresses", async () => {
      kubernetesAddress("redis-primary", {
        default: undefined,
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("kubernetes-address/optional"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional addresses with defaults", async () => {
      kubernetesAddress("redis-primary", {
        default: {
          host: "redis.example.org",
          port: 6379,
        },
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("kubernetes-address/default"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes addresses with named ports", async () => {
      kubernetesAddress("redis-primary", {
        portName: "db",
      });
      kubernetesAddress("redis-primary", {
        portName: "observability",
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("kubernetes-address/named-ports"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes addresses with examples", async () => {
      kubernetesAddress("redis-primary", {
        examples: {
          host: [
            { value: "redis.example.org", label: "remote" },
            { value: "redis.localhost", label: "local" },
          ],
          port: [
            { value: 6379, label: "standard" },
            { value: 6380, label: "alternate" },
          ],
        },
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("kubernetes-address/examples"),
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are network port numbers", () => {
    it("describes required port numbers", async () => {
      networkPortNumber("PORT", "listen port for the HTTP server");
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("network-port-number/required"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional port numbers", async () => {
      networkPortNumber("PORT", "listen port for the HTTP server", {
        default: undefined,
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("network-port-number/optional"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional port numbers with defaults", async () => {
      networkPortNumber("PORT", "listen port for the HTTP server", {
        default: 8080,
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("network-port-number/default"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes port numbers with examples", async () => {
      networkPortNumber("PORT", "listen port for the HTTP server", {
        examples: [
          { value: 80, label: "standard web" },
          { value: 50080, label: "ephemeral" },
        ],
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("network-port-number/examples"),
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are numbers", () => {
    it("describes required numbers", async () => {
      number("WEIGHT", "weighting for this node");
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("number/required"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional numbers", async () => {
      number("WEIGHT", "weighting for this node", {
        default: undefined,
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("number/optional"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional numbers with defaults", async () => {
      number("WEIGHT", "weighting for this node", {
        default: 100.001,
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("number/default"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes numbers with examples", async () => {
      number("WEIGHT", "weighting for this node", {
        examples: [
          { value: 0.01, label: "1%" },
          { value: 0.25, as: "2.5e-1", label: "25%" },
        ],
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("number/examples"),
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are strings", () => {
    it("describes required strings", async () => {
      string("READ_DSN", "database connection string for read-models");
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("string/required"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional strings", async () => {
      string("READ_DSN", "database connection string for read-models", {
        default: undefined,
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("string/optional"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional strings with defaults", async () => {
      string("READ_DSN", "database connection string for read-models", {
        default: "host=localhost dbname=readmodels user=projector",
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("string/default"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional strings with defaults that need quoting", async () => {
      string("MESSAGE", "message to output", {
        default: "Season's greetings, world!",
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("string/quoting"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes strings with examples", async () => {
      string("READ_DSN", "database connection string for read-models", {
        examples: [
          {
            value: "host=localhost dbname=readmodels user=projector",
            label: "local",
          },
          {
            value: "host=remote.example.org dbname=readmodels user=projector",
            label: "remote",
          },
        ],
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("string/examples"),
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are URLs", () => {
    it("describes required URLs", async () => {
      url("CDN_URL", "CDN to use when serving static assets");
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("url/required"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional URLs", async () => {
      url("CDN_URL", "CDN to use when serving static assets", {
        default: undefined,
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("url/optional"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional URLs with defaults", async () => {
      url("CDN_URL", "CDN to use when serving static assets", {
        default: new URL("https://default.example.org/path/to/resource"),
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("url/default"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes URLs with base URLs", async () => {
      url("LOGO", "Main logo image", {
        base: new URL("https://base.example.org/path/to/resource"),
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("url/base"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes URLs with protocol requirements", async () => {
      url("CDN_URL", "CDN to use when serving static assets", {
        protocols: ["https:"],
      });
      url("SOCKET_SERVER", "WebSocket server to use", {
        protocols: ["ws:", "wss:"],
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("url/protocols"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes URLs with examples", async () => {
      url("CDN_URL", "CDN to use when serving static assets", {
        base: new URL("https://host.example.org/path/to/"),
        examples: [
          {
            value: new URL("https://host.example.org/path/to/resource"),
            label: "absolute",
          },
          {
            value: new URL("https://host.example.org/path/to/resource"),
            as: "resource",
            label: "relative",
          },
        ],
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("url/examples"),
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are constraints", () => {
    it("describes the constraints", async () => {
      string(
        "AUSTENITE_STRING_LENGTH",
        "example string with length constraint",
        {
          length: 1,
          examples: [{ value: "a", label: "example" }],
        },
      );
      string(
        "AUSTENITE_STRING_MIN_LENGTH",
        "example string with minimum length constraint",
        {
          length: { min: 2 },
          examples: [{ value: "ab", label: "example" }],
        },
      );
      string(
        "AUSTENITE_STRING_MAX_LENGTH",
        "example string with maximum length constraint",
        {
          length: { max: 3 },
          examples: [{ value: "abc", label: "example" }],
        },
      );
      string(
        "AUSTENITE_STRING_LENGTH_RANGE",
        "example string with length range constraint",
        {
          length: { min: 4, max: 5 },
          examples: [{ value: "abcd", label: "example" }],
        },
      );
      binary(
        "AUSTENITE_BINARY_LENGTH",
        "example binary with length constraint",
        {
          length: 1,
          examples: [{ value: Buffer.from("a", "utf-8"), label: "example" }],
        },
      );
      binary(
        "AUSTENITE_BINARY_MIN_LENGTH",
        "example binary with minimum length constraint",
        {
          length: { min: 2 },
          examples: [{ value: Buffer.from("ab", "utf-8"), label: "example" }],
        },
      );
      binary(
        "AUSTENITE_BINARY_MAX_LENGTH",
        "example binary with maximum length constraint",
        {
          length: { max: 3 },
          examples: [{ value: Buffer.from("abc", "utf-8"), label: "example" }],
        },
      );
      binary(
        "AUSTENITE_BINARY_LENGTH_RANGE",
        "example binary with length range constraint",
        {
          length: { min: 4, max: 5 },
          examples: [{ value: Buffer.from("abcd", "utf-8"), label: "example" }],
        },
      );
      number(
        "AUSTENITE_NUMBER_MIN",
        "example number with inclusive minimum constraint",
        {
          min: 1,
          minIsExclusive: false,
          examples: [{ value: 1, label: "example" }],
        },
      );
      number(
        "AUSTENITE_NUMBER_MIN_EXCLUSIVE",
        "example number with exclusive minimum constraint",
        {
          min: 2,
          minIsExclusive: true,
          examples: [{ value: 2.1, label: "example" }],
        },
      );
      number(
        "AUSTENITE_NUMBER_MAX",
        "example number with inclusive maximum constraint",
        {
          max: 3,
          maxIsExclusive: false,
          examples: [{ value: 3, label: "example" }],
        },
      );
      number(
        "AUSTENITE_NUMBER_MAX_EXCLUSIVE",
        "example number with exclusive maximum constraint",
        {
          max: 4,
          maxIsExclusive: true,
          examples: [{ value: 3.9, label: "example" }],
        },
      );
      number("AUSTENITE_NUMBER_RANGE", "example number with range constraint", {
        min: 5,
        minIsExclusive: false,
        max: 6,
        maxIsExclusive: true,
        examples: [{ value: 5.5, label: "example" }],
      });
      integer(
        "AUSTENITE_INTEGER_MIN",
        "example integer with minimum constraint",
        {
          min: 1,
          examples: [{ value: 1, label: "example" }],
        },
      );
      integer(
        "AUSTENITE_INTEGER_MAX",
        "example integer with maximum constraint",
        {
          max: 2,
          examples: [{ value: 2, label: "example" }],
        },
      );
      integer(
        "AUSTENITE_INTEGER_RANGE",
        "example integer with range constraint",
        {
          min: 3,
          max: 4,
          examples: [{ value: 3, label: "example" }],
        },
      );
      bigInteger(
        "AUSTENITE_INTEGER_BIG_MIN",
        "example big integer with minimum constraint",
        {
          min: 1n,
          examples: [{ value: 1n, label: "example" }],
        },
      );
      bigInteger(
        "AUSTENITE_INTEGER_BIG_MAX",
        "example big integer with maximum constraint",
        {
          max: 2n,
          examples: [{ value: 2n, label: "example" }],
        },
      );
      bigInteger(
        "AUSTENITE_INTEGER_BIG_RANGE",
        "example big integer with range constraint",
        {
          min: 3n,
          max: 4n,
          examples: [{ value: 3n, label: "example" }],
        },
      );
      networkPortNumber(
        "AUSTENITE_PORT_NUMBER_MIN",
        "example port number with minimum constraint",
        {
          min: 11111,
          examples: [{ value: 11111, label: "example" }],
        },
      );
      networkPortNumber(
        "AUSTENITE_PORT_NUMBER_MAX",
        "example port number with maximum constraint",
        {
          max: 22222,
          examples: [{ value: 22222, label: "example" }],
        },
      );
      networkPortNumber(
        "AUSTENITE_PORT_NUMBER_RANGE",
        "example port number with range constraint",
        {
          min: 33333,
          max: 44444,
          examples: [{ value: 33333, label: "example" }],
        },
      );
      duration(
        "AUSTENITE_DURATION_MIN",
        "example duration with minimum constraint",
        {
          min: Duration.from("PT1S"),
          examples: [{ value: Duration.from("PT1S"), label: "example" }],
        },
      );
      duration(
        "AUSTENITE_DURATION_MAX",
        "example duration with maximum constraint",
        {
          max: Duration.from("PT2S"),
          examples: [{ value: Duration.from("PT2S"), label: "example" }],
        },
      );
      duration(
        "AUSTENITE_DURATION_RANGE",
        "example duration with range constraint",
        {
          min: Duration.from("PT3S"),
          max: Duration.from("PT4S"),
          examples: [{ value: Duration.from("PT3S"), label: "example" }],
        },
      );
      enumeration(
        "AUSTENITE_ENUMERATION_MIN",
        "example enumeration with minimum constraint",
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
          constraints: [
            {
              description: "must be >= bar",
              constrain: (v) => v >= "bar" || "must be >= bar",
            },
          ],
          examples: [{ value: "bar", label: "example" }],
        },
      );
      url("AUSTENITE_URL_ABSOLUTE", "example URL with protocols constraint", {
        protocols: ["https:"],
        examples: [
          {
            value: new URL("https://example.org/path/to/resource"),
            label: "example",
          },
        ],
      });
      url(
        "AUSTENITE_URL_BASE",
        "example URL with base URL and protocols constraint",
        {
          base: new URL("https://example.org/path/to/"),
          protocols: ["https:"],
          examples: [
            {
              value: new URL("https://example.org/path/to/resource"),
              label: "example",
            },
          ],
        },
      );
      string("AUSTENITE_CUSTOM", "custom variable", {
        constraints: [
          {
            description: "must start with a greeting",
            constrain(v) {
              if (!v.match(/^(Hi|Hello)\b/)) {
                return 'must start with "Hi" or "Hello"';
              }
            },
          },
          {
            description: "must end with a subject",
            constrain(v) {
              if (!v.match(/\b(world|universe)!$/i)) {
                return 'must end with "world!" or "universe!"';
              }
            },
          },
        ],
        examples: [{ value: "Hello, world!", label: "example" }],
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("constraints"),
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are examples", () => {
    it("describes the examples", async () => {
      bigInteger("AUSTENITE_INTEGER_BIG", "example big integer", {
        examples: [
          {
            value: 12345678901234567890n,
            label: "<bigInteger example A>",
          },
          {
            value: 98765432109876543210n,
            label: "<bigInteger example B>",
          },
        ],
      });
      binary("AUSTENITE_BINARY", "example binary", {
        examples: [
          {
            value: Buffer.from("Beep boop!", "utf-8"),
            label: "<binary example A>",
          },
          {
            value: Buffer.from("Boop beep!", "utf-8"),
            label: "<binary example B>",
          },
        ],
      });
      boolean("AUSTENITE_BOOLEAN", "example boolean", {
        examples: [
          {
            value: true,
            label: "<boolean example A>",
          },
          {
            value: false,
            label: "<boolean example B>",
          },
        ],
      });
      duration("AUSTENITE_DURATION", "example duration", {
        examples: [
          {
            value: Duration.from("PT10S"),
            label: "<duration example A>",
          },
          {
            value: Duration.from("PT20S"),
            label: "<duration example B>",
          },
        ],
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
          examples: [
            {
              value: "foo",
              label: "<enumeration example A>",
            },
            {
              value: "bar",
              label: "<enumeration example B>",
            },
          ],
        },
      );
      integer("AUSTENITE_INTEGER", "example integer", {
        examples: [
          {
            value: 123456,
            label: "<integer example A>",
          },
          {
            value: 654321,
            label: "<integer example B>",
          },
        ],
      });
      kubernetesAddress("austenite-svc", {
        examples: {
          host: [
            {
              value: "host.example.org",
              label: "<k8s address host example A>",
            },
            {
              value: "host.example.com",
              label: "<k8s address host example B>",
            },
          ],
          port: [
            {
              value: 321,
              label: "<k8s address port example A>",
            },
            {
              value: 432,
              label: "<k8s address port example B>",
            },
          ],
        },
      });
      networkPortNumber("AUSTENITE_PORT_NUMBER", "example port number", {
        examples: [
          {
            value: 123,
            label: "<port number example A>",
          },
          {
            value: 234,
            label: "<port number example B>",
          },
        ],
      });
      number("AUSTENITE_NUMBER", "example number", {
        examples: [
          {
            value: 123.456,
            label: "<number example A>",
          },
          {
            value: 654.321,
            label: "<number example B>",
          },
        ],
      });
      string("AUSTENITE_STRING", "example string", {
        examples: [
          {
            value: "<value A>",
            label: "<string example A>",
          },
          {
            value: "<value B>",
            label: "<string example B>",
          },
        ],
      });
      url("AUSTENITE_URL", "example URL", {
        base: new URL("https://example.com/path/to/"),
        examples: [
          {
            value: new URL("https://example.org/path/to/resource"),
            label: "<URL example A>",
          },
          {
            value: new URL("https://example.com/path/to/resource"),
            as: "resource",
            label: "<URL example B>",
          },
        ],
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("examples"),
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are sensitive declarations", () => {
    it("doesn't leak default values", async () => {
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
        },
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
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("sensitive"),
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are no declarations", () => {
    it("describes an empty environment", async () => {
      await initialize();

      await expect(
        "<BEGIN>\n" + mockConsole.readStdout() + "\n<END>\n",
      ).toMatchFileSnapshot(fixturePath("empty"));
      expect(exitCode).toBe(0);
    });
  });

  describe("when the AUSTENITE_APP environment variable is set", () => {
    beforeEach(() => {
      process.env.AUSTENITE_APP = "<custom app name>";
    });

    it("uses the value as the app name", async () => {
      await initialize();

      await expect(
        "<BEGIN>\n" + mockConsole.readStdout() + "\n<END>\n",
      ).toMatchFileSnapshot(fixturePath("app-env-var"));
      expect(exitCode).toBe(0);
    });
  });

  describe("when a variable has non-paragraph Markdown content", () => {
    it("renders the content as text", async () => {
      string(
        "AUSTENITE_STRING",
        "## [Not a heading](https://malicious.example.org)",
      );

      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("markdown-escaping"),
      );
      expect(exitCode).toBe(0);
    });
  });
});

function fixturePath(name: string): string {
  return join(fixturesPath, `${name}.md`);
}
