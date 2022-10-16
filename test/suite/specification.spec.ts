import { Temporal } from "@js-temporal/polyfill";
import { readFile } from "fs/promises";
import { join } from "path";
import { boolean } from "../../src/boolean";
import { duration } from "../../src/duration";
import { initialize, reset, setProcessExit } from "../../src/environment";
import { kubernetesAddress } from "../../src/kubernetes-address";
import { string } from "../../src/string";
import { createMockConsole, MockConsole } from "../helpers";

const fixturesPath = join(__dirname, "../fixture/specification");

const { Duration } = Temporal;

describe("Specification documents", () => {
  let exitCode: number | undefined;
  let argv: typeof process.argv;
  let env: typeof process.env;
  let mockConsole: MockConsole;

  function processExit(code: number): never {
    exitCode = code;

    return undefined as never;
  }

  beforeEach(() => {
    exitCode = undefined;
    setProcessExit(processExit);

    argv = process.argv;
    process.argv = [process.argv0, "<app>"];
    env = process.env;
    process.env = { ...env };

    mockConsole = createMockConsole();
  });

  afterEach(() => {
    jest.resetAllMocks();
    process.argv = argv;
    process.env = env;
    reset();
  });

  describe("when there are booleans", () => {
    it("describes required booleans", async () => {
      process.env.AUSTENITE_SPEC = "true";
      boolean("DEBUG", "enable or disable debugging features");
      initialize();

      expect(mockConsole.readStdout()).toBe(
        await readFixture("boolean/required")
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional booleans", async () => {
      process.env.AUSTENITE_SPEC = "true";
      boolean("DEBUG", "enable or disable debugging features", {
        default: undefined,
      });
      initialize();

      expect(mockConsole.readStdout()).toBe(
        await readFixture("boolean/optional")
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional booleans with defaults", async () => {
      process.env.AUSTENITE_SPEC = "true";
      boolean("DEBUG", "enable or disable debugging features", {
        default: false,
      });
      boolean("PRODUCTION", "enable or disable production mode", {
        default: true,
      });
      initialize();

      expect(mockConsole.readStdout()).toBe(
        await readFixture("boolean/default")
      );
      expect(exitCode).toBe(0);
    });

    it("describes booleans with custom literals", async () => {
      process.env.AUSTENITE_SPEC = "true";
      boolean("DEBUG", "enable or disable debugging features", {
        default: false,
        literals: {
          true: ["y", "yes"],
          false: ["n", "no"],
        },
      });
      initialize();

      expect(mockConsole.readStdout()).toBe(
        await readFixture("boolean/custom-literals")
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are durations", () => {
    it("describes required durations", async () => {
      process.env.AUSTENITE_SPEC = "true";
      duration("GRPC_TIMEOUT", "gRPC request timeout");
      initialize();

      expect(mockConsole.readStdout()).toBe(
        await readFixture("duration/required")
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional durations", async () => {
      process.env.AUSTENITE_SPEC = "true";
      duration("GRPC_TIMEOUT", "gRPC request timeout", {
        default: undefined,
      });
      initialize();

      expect(mockConsole.readStdout()).toBe(
        await readFixture("duration/optional")
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional durations with defaults", async () => {
      process.env.AUSTENITE_SPEC = "true";
      duration("GRPC_TIMEOUT", "gRPC request timeout", {
        default: Duration.from("PT0.01S"),
      });
      initialize();

      expect(mockConsole.readStdout()).toBe(
        await readFixture("duration/default")
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are kubernetes addresses", () => {
    it("describes required addresses", async () => {
      process.env.AUSTENITE_SPEC = "true";
      kubernetesAddress("redis-primary");
      initialize();

      expect(mockConsole.readStdout()).toBe(
        await readFixture("kubernetes-address/required")
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional addresses", async () => {
      process.env.AUSTENITE_SPEC = "true";
      kubernetesAddress("redis-primary", {
        default: undefined,
      });
      initialize();

      expect(mockConsole.readStdout()).toBe(
        await readFixture("kubernetes-address/optional")
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional addresses with defaults", async () => {
      process.env.AUSTENITE_SPEC = "true";
      kubernetesAddress("redis-primary", {
        default: {
          host: "redis.example.org",
          port: 6379,
        },
      });
      initialize();

      expect(mockConsole.readStdout()).toBe(
        await readFixture("kubernetes-address/default")
      );
      expect(exitCode).toBe(0);
    });

    it("describes addresses with named ports", async () => {
      process.env.AUSTENITE_SPEC = "true";
      kubernetesAddress("redis-primary", {
        portName: "db",
      });
      kubernetesAddress("redis-primary", {
        portName: "observability",
      });
      initialize();

      expect(mockConsole.readStdout()).toBe(
        await readFixture("kubernetes-address/named-ports")
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when there are strings", () => {
    it("describes required strings", async () => {
      process.env.AUSTENITE_SPEC = "true";
      string("READ_DSN", "database connection string for read-models");
      initialize();

      expect(mockConsole.readStdout()).toBe(
        await readFixture("string/required")
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional strings", async () => {
      process.env.AUSTENITE_SPEC = "true";
      string("READ_DSN", "database connection string for read-models", {
        default: undefined,
      });
      initialize();

      expect(mockConsole.readStdout()).toBe(
        await readFixture("string/optional")
      );
      expect(exitCode).toBe(0);
    });

    it("describes optional strings with defaults", async () => {
      process.env.AUSTENITE_SPEC = "true";
      string("READ_DSN", "database connection string for read-models", {
        default: "host=localhost dbname=readmodels user=projector",
      });
      initialize();

      expect(mockConsole.readStdout()).toBe(
        await readFixture("string/default")
      );
      expect(exitCode).toBe(0);
    });
  });
});

async function readFixture(name: string): Promise<string> {
  const fixturePath = join(fixturesPath, `${name}.md`);

  return (await readFile(fixturePath)).toString();
}
