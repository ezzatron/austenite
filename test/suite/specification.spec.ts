import { jest } from "@jest/globals";
import { Temporal } from "@js-temporal/polyfill";
import { readFile } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";
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
} from "../../src/index.js";
import { createMockConsole, MockConsole } from "../helpers.js";

const fixturesPath = fileURLToPath(
  new URL("../fixture/specification", import.meta.url)
);

const { Duration } = Temporal;

describe("Specification documents", () => {
  let exitCode: number | undefined;
  let mockConsole: MockConsole;

  beforeEach(() => {
    exitCode = undefined;
    jest.spyOn(process, "exit").mockImplementation((code) => {
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

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("big-integer/required")
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional big integers", async () => {
      bigInteger("WEIGHT", "weighting for this node", {
        default: undefined,
      });
      initialize();

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("big-integer/optional")
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional big integers with defaults", async () => {
      bigInteger("WEIGHT", "weighting for this node", {
        default: 10000000000000001n,
      });
      initialize();

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("big-integer/default")
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are booleans", () => {
    it("describes required booleans", async () => {
      boolean("DEBUG", "enable or disable debugging features");
      initialize();

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("boolean/required")
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional booleans", async () => {
      boolean("DEBUG", "enable or disable debugging features", {
        default: undefined,
      });
      initialize();

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("boolean/optional")
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

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("boolean/default")
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

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("boolean/custom-literals")
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are durations", () => {
    it("describes required durations", async () => {
      duration("GRPC_TIMEOUT", "gRPC request timeout");
      initialize();

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("duration/required")
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional durations", async () => {
      duration("GRPC_TIMEOUT", "gRPC request timeout", {
        default: undefined,
      });
      initialize();

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("duration/optional")
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional durations with defaults", async () => {
      duration("GRPC_TIMEOUT", "gRPC request timeout", {
        default: Duration.from("PT0.01S"),
      });
      initialize();

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("duration/default")
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

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("enumeration/required")
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional enumerations", async () => {
      enumeration("LOG_LEVEL", "the minimum log level to record", members, {
        default: undefined,
      });
      initialize();

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("enumeration/optional")
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional enumerations with defaults", async () => {
      enumeration("LOG_LEVEL", "the minimum log level to record", members, {
        default: "error",
      });
      initialize();

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("enumeration/default")
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are integers", () => {
    it("describes required integers", async () => {
      integer("WEIGHT", "weighting for this node");
      initialize();

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("integer/required")
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional integers", async () => {
      integer("WEIGHT", "weighting for this node", {
        default: undefined,
      });
      initialize();

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("integer/optional")
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional integers with defaults", async () => {
      integer("WEIGHT", "weighting for this node", {
        default: 101,
      });
      initialize();

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("integer/default")
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are kubernetes addresses", () => {
    it("describes required addresses", async () => {
      kubernetesAddress("redis-primary");
      initialize();

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("kubernetes-address/required")
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional addresses", async () => {
      kubernetesAddress("redis-primary", {
        default: undefined,
      });
      initialize();

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("kubernetes-address/optional")
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

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("kubernetes-address/default")
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

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("kubernetes-address/named-ports")
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are numbers", () => {
    it("describes required numbers", async () => {
      number("WEIGHT", "weighting for this node");
      initialize();

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("number/required")
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional numbers", async () => {
      number("WEIGHT", "weighting for this node", {
        default: undefined,
      });
      initialize();

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("number/optional")
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional numbers with defaults", async () => {
      number("WEIGHT", "weighting for this node", {
        default: 100.001,
      });
      initialize();

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("number/default")
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are strings", () => {
    it("describes required strings", async () => {
      string("READ_DSN", "database connection string for read-models");
      initialize();

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("string/required")
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional strings", async () => {
      string("READ_DSN", "database connection string for read-models", {
        default: undefined,
      });
      initialize();

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("string/optional")
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional strings with defaults", async () => {
      string("READ_DSN", "database connection string for read-models", {
        default: "host=localhost dbname=readmodels user=projector",
      });
      initialize();

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("string/default")
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional strings with defaults that need quoting", async () => {
      string("MESSAGE", "message to output", {
        default: "Season's greetings, world!",
      });
      initialize();

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("string/quoting")
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are URLs", () => {
    it("describes required URLs", async () => {
      url("CDN_URL", "CDN to use when serving static assets");
      initialize();

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("url/required")
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional URLs", async () => {
      url("CDN_URL", "CDN to use when serving static assets", {
        default: undefined,
      });
      initialize();

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("url/optional")
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional URLs with defaults", async () => {
      url("CDN_URL", "CDN to use when serving static assets", {
        default: new URL("https://default.example.org/path/to/resource"),
      });
      initialize();

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("url/default")
      );
      expect(exitCode).toBe(0);
    });

    it("describes URLs with base URLs", async () => {
      url("LOGO", "Main logo image", {
        base: new URL("https://base.example.org/path/to/resource"),
      });
      initialize();

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("url/base")
      );
      expect(exitCode).toBe(0);
    });

    it("describes URLs with protocol requirements", async () => {
      url("SOCKET_SERVER", "WebSocket server to use", {
        protocols: ["ws:", "wss:"],
      });
      initialize();

      expect(stripUsage(mockConsole.readStdout())).toBe(
        await readFixture("url/protocols")
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there no declarations", () => {
    it("describes an empty environment", async () => {
      initialize();

      expect(mockConsole.readStdout()).toBe(await readFixture("empty"));
      expect(exitCode).toBe(0);
    });
  });

  it("provides usage instructions", async () => {
    boolean("DEBUG", "enable or disable debugging features", {
      default: undefined,
    });
    initialize();

    expect(mockConsole.readStdout()).toBe(await readFixture("usage"));
    expect(exitCode).toBe(0);
  });
});

async function readFixture(name: string): Promise<string> {
  const fixturePath = join(fixturesPath, `${name}.md`);

  return (await readFile(fixturePath)).toString();
}

function stripUsage(output: string): string {
  return output.split("\n## Usage Examples")[0];
}
