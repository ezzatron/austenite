import { readFile } from "fs/promises";
import { Console } from "node:console";
import { Transform } from "node:stream";
import { join } from "path";
import { string } from "../../src";
import { initialize, reset } from "../../src/environment";

const fixturesPath = join(__dirname, "../fixture/specification");

describe("Specification documents", () => {
  let argv: typeof process.argv;
  let env: typeof process.env;
  let readConsole: () => string;

  beforeEach(() => {
    jest.spyOn(process, "exit").mockImplementation();

    argv = process.argv;
    process.argv = [process.argv0, "<app>"];
    env = process.env;
    process.env = { ...env };

    const stdout = new Transform({
      transform(chunk, _, cb) {
        cb(null, chunk);
      },
    });
    const mockConsole = new Console({ stdout });

    jest
      .spyOn(console, "log")
      .mockImplementation(mockConsole.log.bind(mockConsole));

    readConsole = () => String(stdout.read() ?? "");
  });

  afterEach(() => {
    jest.resetAllMocks();
    process.argv = argv;
    process.env = env;
    reset();
  });

  it("describes required string variables", async () => {
    process.env.AUSTENITE_SPEC = "true";
    string("READ_DSN", "database connection string for read-models");
    initialize();

    expect(readConsole()).toBe(await readFixture("string/required"));
  });
});

async function readFixture(name: string): Promise<string> {
  const fixturePath = join(fixturesPath, `${name}.md`);

  return (await readFile(fixturePath)).toString();
}
