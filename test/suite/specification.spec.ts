import { readFile } from "fs/promises";
import { join } from "path";
import { boolean, initialize, kubernetesAddress, string } from "../../src";
import { reset } from "../../src/environment";
import { createMockConsole, MockConsole } from "../helpers";

const fixturesPath = join(__dirname, "../fixture/specification");

describe("Specification documents", () => {
  let argv: typeof process.argv;
  let env: typeof process.env;
  let mockConsole: MockConsole;

  beforeEach(() => {
    jest.spyOn(process, "exit").mockImplementation();

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
    });
  });
});

async function readFixture(name: string): Promise<string> {
  const fixturePath = join(fixturesPath, `${name}.md`);

  return (await readFile(fixturePath)).toString();
}
