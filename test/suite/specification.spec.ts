import { Temporal } from "@js-temporal/polyfill";
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
    it("describes required big integers", () => {
      bigInteger("WEIGHT", "weighting for this node");
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it("describes optional big integers", () => {
      bigInteger("WEIGHT", "weighting for this node", {
        default: undefined,
      });
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it("describes optional big integers with defaults", () => {
      bigInteger("WEIGHT", "weighting for this node", {
        default: 10000000000000001n,
      });
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are binaries", () => {
    it("describes required binaries", () => {
      binary("SESSION_KEY", "session token signing key");
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it("describes optional binaries", () => {
      binary("SESSION_KEY", "session token signing key", {
        default: undefined,
      });
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it("describes optional binaries with defaults", () => {
      binary("SESSION_KEY", "session token signing key", {
        default: Buffer.from(
          "XY7l3m0bmuzX5IAu6/KUyPRQXKc8H1LjAl2Q897vbYw=",
          "base64",
        ),
      });
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are booleans", () => {
    it("describes required booleans", () => {
      boolean("DEBUG", "enable or disable debugging features");
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it("describes optional booleans", () => {
      boolean("DEBUG", "enable or disable debugging features", {
        default: undefined,
      });
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it("describes optional booleans with defaults", () => {
      boolean("DEBUG", "enable or disable debugging features", {
        default: false,
      });
      boolean("PRODUCTION", "enable or disable production mode", {
        default: true,
      });
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it("describes booleans with custom literals", () => {
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

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are durations", () => {
    it("describes required durations", () => {
      duration("GRPC_TIMEOUT", "gRPC request timeout");
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it("describes optional durations", () => {
      duration("GRPC_TIMEOUT", "gRPC request timeout", {
        default: undefined,
      });
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it("describes optional durations with defaults", () => {
      duration("GRPC_TIMEOUT", "gRPC request timeout", {
        default: Duration.from("PT0.01S"),
      });
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
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

    it("describes required enumerations", () => {
      enumeration("LOG_LEVEL", "the minimum log level to record", members);
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it("describes optional enumerations", () => {
      enumeration("LOG_LEVEL", "the minimum log level to record", members, {
        default: undefined,
      });
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it("describes optional enumerations with defaults", () => {
      enumeration("LOG_LEVEL", "the minimum log level to record", members, {
        default: "error",
      });
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are integers", () => {
    it("describes required integers", () => {
      integer("WEIGHT", "weighting for this node");
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it("describes optional integers", () => {
      integer("WEIGHT", "weighting for this node", {
        default: undefined,
      });
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it("describes optional integers with defaults", () => {
      integer("WEIGHT", "weighting for this node", {
        default: 101,
      });
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are kubernetes addresses", () => {
    it("describes required addresses", () => {
      kubernetesAddress("redis-primary");
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it("describes optional addresses", () => {
      kubernetesAddress("redis-primary", {
        default: undefined,
      });
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it("describes optional addresses with defaults", () => {
      kubernetesAddress("redis-primary", {
        default: {
          host: "redis.example.org",
          port: 6379,
        },
      });
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it("describes addresses with named ports", () => {
      kubernetesAddress("redis-primary", {
        portName: "db",
      });
      kubernetesAddress("redis-primary", {
        portName: "observability",
      });
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are network port numbers", () => {
    it("describes required port numbers", () => {
      networkPortNumber("PORT", "listen port for the HTTP server");
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it("describes optional port numbers", () => {
      networkPortNumber("PORT", "listen port for the HTTP server", {
        default: undefined,
      });
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it("describes optional port numbers with defaults", () => {
      networkPortNumber("PORT", "listen port for the HTTP server", {
        default: 8080,
      });
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are numbers", () => {
    it("describes required numbers", () => {
      number("WEIGHT", "weighting for this node");
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it("describes optional numbers", () => {
      number("WEIGHT", "weighting for this node", {
        default: undefined,
      });
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it("describes optional numbers with defaults", () => {
      number("WEIGHT", "weighting for this node", {
        default: 100.001,
      });
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are strings", () => {
    it("describes required strings", () => {
      string("READ_DSN", "database connection string for read-models");
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it("describes optional strings", () => {
      string("READ_DSN", "database connection string for read-models", {
        default: undefined,
      });
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it("describes optional strings with defaults", () => {
      string("READ_DSN", "database connection string for read-models", {
        default: "host=localhost dbname=readmodels user=projector",
      });
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it("describes optional strings with defaults that need quoting", () => {
      string("MESSAGE", "message to output", {
        default: "Season's greetings, world!",
      });
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are URLs", () => {
    it("describes required URLs", () => {
      url("CDN_URL", "CDN to use when serving static assets");
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it("describes optional URLs", () => {
      url("CDN_URL", "CDN to use when serving static assets", {
        default: undefined,
      });
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it("describes optional URLs with defaults", () => {
      url("CDN_URL", "CDN to use when serving static assets", {
        default: new URL("https://default.example.org/path/to/resource"),
      });
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it("describes URLs with base URLs", () => {
      url("LOGO", "Main logo image", {
        base: new URL("https://base.example.org/path/to/resource"),
      });
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });

    it("describes URLs with protocol requirements", () => {
      url("SOCKET_SERVER", "WebSocket server to use", {
        protocols: ["ws:", "wss:"],
      });
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });
  });

  describe("when there no declarations", () => {
    it("describes an empty environment", () => {
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });
  });

  it("provides usage instructions", () => {
    boolean("DEBUG", "enable or disable debugging features", {
      default: undefined,
    });
    initialize();

    expect(mockConsole.readStdout()).toMatchSnapshot();
    expect(exitCode).toBe(0);
  });

  describe("when the AUSTENITE_APP environment variable is set", () => {
    beforeEach(() => {
      process.env.AUSTENITE_APP = "<custom app name>";
    });

    it("uses the value as the app name", () => {
      initialize();

      expect(mockConsole.readStdout()).toMatchSnapshot();
      expect(exitCode).toBe(0);
    });
  });
});
