import { readFile } from "fs/promises";
import { join } from "path";
import { boolean, string } from "../../src";
import { initialize, reset } from "../../src/environment";
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

  describe("when there are string variables", () => {
    it("describes required string variables with no defaults", async () => {
      process.env.AUSTENITE_SPEC = "true";
      string("READ_DSN", "database connection string for read-models");
      initialize();

      expect(mockConsole.readStdout()).toBe(
        await readFixture("string/required")
      );
    });

    it("describes optional string variables with no defaults", async () => {
      process.env.AUSTENITE_SPEC = "true";
      string("READ_DSN", "database connection string for read-models", {
        required: false,
      });
      initialize();

      expect(mockConsole.readStdout()).toBe(
        await readFixture("string/optional")
      );
    });

    it("describes string variables with defaults", async () => {
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

  describe("when there are boolean variables", () => {
    it("describes required boolean variables with no defaults", async () => {
      process.env.AUSTENITE_SPEC = "true";
      boolean("DEBUG", "enable or disable debugging features");
      initialize();

      expect(mockConsole.readStdout()).toBe(
        await readFixture("boolean/required")
      );
    });

    it("describes optional boolean variables with no defaults", async () => {
      process.env.AUSTENITE_SPEC = "true";
      boolean("DEBUG", "enable or disable debugging features", {
        required: false,
      });
      initialize();

      expect(mockConsole.readStdout()).toBe(
        await readFixture("boolean/optional")
      );
    });

    it("describes boolean variables with defaults", async () => {
      process.env.AUSTENITE_SPEC = "true";
      boolean("DEBUG", "enable or disable debugging features", {
        default: false,
      });
      initialize();

      expect(mockConsole.readStdout()).toBe(
        await readFixture("boolean/default")
      );
    });
  });
});

async function readFixture(name: string): Promise<string> {
  const fixturePath = join(fixturesPath, `${name}.md`);

  return (await readFile(fixturePath)).toString();
}
