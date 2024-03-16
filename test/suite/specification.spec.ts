import { Temporal } from "@js-temporal/polyfill";
import { join } from "path";
import { fileURLToPath } from "url";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
      exitCode = code ?? 0;

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
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("big-integer/required"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional big integers", async () => {
      bigInteger("WEIGHT", "weighting for this node", {
        default: undefined,
      });
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("big-integer/optional"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional big integers with defaults", async () => {
      bigInteger("WEIGHT", "weighting for this node", {
        default: 10000000000000001n,
      });
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("big-integer/default"),
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are binaries", () => {
    it("describes required binaries", async () => {
      binary("SESSION_KEY", "session token signing key");
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("binary/required"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional binaries", async () => {
      binary("SESSION_KEY", "session token signing key", {
        default: undefined,
      });
      initialize();

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
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("binary/default"),
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are booleans", () => {
    it("describes required booleans", async () => {
      boolean("DEBUG", "enable or disable debugging features");
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("boolean/required"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional booleans", async () => {
      boolean("DEBUG", "enable or disable debugging features", {
        default: undefined,
      });
      initialize();

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
      initialize();

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
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("boolean/custom-literals"),
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are durations", () => {
    it("describes required durations", async () => {
      duration("GRPC_TIMEOUT", "gRPC request timeout");
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("duration/required"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional durations", async () => {
      duration("GRPC_TIMEOUT", "gRPC request timeout", {
        default: undefined,
      });
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("duration/optional"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional durations with defaults", async () => {
      duration("GRPC_TIMEOUT", "gRPC request timeout", {
        default: Duration.from("PT0.01S"),
      });
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("duration/default"),
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
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("enumeration/required"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional enumerations", async () => {
      enumeration("LOG_LEVEL", "the minimum log level to record", members, {
        default: undefined,
      });
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("enumeration/optional"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional enumerations with defaults", async () => {
      enumeration("LOG_LEVEL", "the minimum log level to record", members, {
        default: "error",
      });
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("enumeration/default"),
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are integers", () => {
    it("describes required integers", async () => {
      integer("WEIGHT", "weighting for this node");
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("integer/required"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional integers", async () => {
      integer("WEIGHT", "weighting for this node", {
        default: undefined,
      });
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("integer/optional"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional integers with defaults", async () => {
      integer("WEIGHT", "weighting for this node", {
        default: 101,
      });
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("integer/default"),
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are kubernetes addresses", () => {
    it("describes required addresses", async () => {
      kubernetesAddress("redis-primary");
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("kubernetes-address/required"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional addresses", async () => {
      kubernetesAddress("redis-primary", {
        default: undefined,
      });
      initialize();

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
      initialize();

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
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("kubernetes-address/named-ports"),
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are network port numbers", () => {
    it("describes required port numbers", async () => {
      networkPortNumber("PORT", "listen port for the HTTP server");
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("network-port-number/required"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional port numbers", async () => {
      networkPortNumber("PORT", "listen port for the HTTP server", {
        default: undefined,
      });
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("network-port-number/optional"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional port numbers with defaults", async () => {
      networkPortNumber("PORT", "listen port for the HTTP server", {
        default: 8080,
      });
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("network-port-number/default"),
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are numbers", () => {
    it("describes required numbers", async () => {
      number("WEIGHT", "weighting for this node");
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("number/required"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional numbers", async () => {
      number("WEIGHT", "weighting for this node", {
        default: undefined,
      });
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("number/optional"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional numbers with defaults", async () => {
      number("WEIGHT", "weighting for this node", {
        default: 100.001,
      });
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("number/default"),
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are strings", () => {
    it("describes required strings", async () => {
      string("READ_DSN", "database connection string for read-models");
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("string/required"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional strings", async () => {
      string("READ_DSN", "database connection string for read-models", {
        default: undefined,
      });
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("string/optional"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional strings with defaults", async () => {
      string("READ_DSN", "database connection string for read-models", {
        default: "host=localhost dbname=readmodels user=projector",
      });
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("string/default"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional strings with defaults that need quoting", async () => {
      string("MESSAGE", "message to output", {
        default: "Season's greetings, world!",
      });
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("string/quoting"),
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are URLs", () => {
    it("describes required URLs", async () => {
      url("CDN_URL", "CDN to use when serving static assets");
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("url/required"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional URLs", async () => {
      url("CDN_URL", "CDN to use when serving static assets", {
        default: undefined,
      });
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("url/optional"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional URLs with defaults", async () => {
      url("CDN_URL", "CDN to use when serving static assets", {
        default: new URL("https://default.example.org/path/to/resource"),
      });
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("url/default"),
      );
      expect(exitCode).toBe(0);
    });

    it("describes URLs with base URLs", async () => {
      url("LOGO", "Main logo image", {
        base: new URL("https://base.example.org/path/to/resource"),
      });
      initialize();

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
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("url/protocols"),
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

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("sensitive"),
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are no declarations", () => {
    it("describes an empty environment", async () => {
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("empty"),
      );
      expect(exitCode).toBe(0);
    });
  });

  it("provides usage instructions", async () => {
    boolean("DEBUG", "enable or disable debugging features", {
      default: undefined,
    });
    initialize();

    await expect(mockConsole.readStdout()).toMatchFileSnapshot(
      fixturePath("usage"),
    );
    expect(exitCode).toBe(0);
  });

  describe("when the AUSTENITE_APP environment variable is set", () => {
    beforeEach(() => {
      process.env.AUSTENITE_APP = "<custom app name>";
    });

    it("uses the value as the app name", async () => {
      initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("app-env-var"),
      );
      expect(exitCode).toBe(0);
    });
  });
});

function fixturePath(name: string): string {
  return join(fixturesPath, `${name}.md`);
}
