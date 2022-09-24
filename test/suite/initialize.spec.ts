import { Console } from "node:console";
import { Transform } from "node:stream";
import { EOL } from "os";
import { boolean, string } from "../../src";
import { initialize, reset } from "../../src/environment";
import { Options, Variable } from "../../src/variable";

type VariableFactory = (
  name: string,
  description: string,
  options?: Options<unknown> | undefined
) => Variable<unknown, Options<unknown>>;

describe("initialize()", () => {
  let exitCode: number;
  let env: typeof process.env;
  let readConsole: () => string;

  beforeEach(() => {
    jest.spyOn(process, "exit").mockImplementation((code) => {
      exitCode = code ?? 0;

      return undefined as never;
    });

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
    process.env = env;
    reset();
  });

  describe("when the environment is valid", () => {
    describe("before being called", () => {
      it.each`
        type         | factory
        ${"boolean"} | ${boolean}
        ${"string"}  | ${string}
      `(
        "prevents access to $type values",
        ({ factory }: { factory: VariableFactory }) => {
          const variable = factory("AUSTENITE_VAR", "<description>", {
            required: false,
          });

          expect(() => {
            variable.value();
          }).toThrow(
            "AUSTENITE_VAR can not be read until the environment is initialized."
          );
        }
      );
    });

    describe("after being called", () => {
      let variable: Variable<string, Options<string>>;

      beforeEach(() => {
        variable = string("AUSTENITE_VAR", "<description>", {
          required: false,
        });

        initialize();
      });

      it("allows access to values", () => {
        expect(() => {
          variable.value();
        }).not.toThrow();
      });

      it.each`
        type         | factory
        ${"boolean"} | ${boolean}
        ${"string"}  | ${string}
      `(
        "prevents defining additional $type variables",
        ({ factory }: { factory: VariableFactory }) => {
          expect(() => {
            factory("AUSTENITE_VAR", "<description>");
          }).toThrow(
            "AUSTENITE_VAR can not be defined after the environment is initialized."
          );
        }
      );

      describe("when called again", () => {
        it("does nothing", () => {
          expect(() => {
            initialize();
          }).not.toThrow();
        });
      });
    });
  });

  describe("when the environment is invalid", () => {
    describe("before being called", () => {
      it.each`
        type         | factory
        ${"boolean"} | ${boolean}
        ${"string"}  | ${string}
      `(
        "prevents access to $type values",
        ({ factory }: { factory: VariableFactory }) => {
          const variable = factory("AUSTENITE_VAR", "<description>", {
            required: true,
          });

          expect(() => {
            variable.value();
          }).toThrow(
            "AUSTENITE_VAR can not be read until the environment is initialized."
          );
        }
      );
    });

    describe("when called", () => {
      beforeEach(() => {
        process.env.AUSTENITE_BOOLEAN = "y";
        process.env.AUSTENITE_STRING = "hello, world!";

        string("AUSTENITE_XTRIGGER", "trigger failure");
        string("AUSTENITE_STRING", "example string");
        boolean("AUSTENITE_BOOLEAN", "example boolean", {
          literals: { true: ["y", "yes"], false: ["n", "no"] },
        });

        initialize();
      });

      it("outputs a summary table", () => {
        expect(readConsole()).toBe(
          [
            `Environment Variables:`,
            ``,
            `  AUSTENITE_BOOLEAN   example boolean  y | yes | n | no  ✓ set to true`,
            `  AUSTENITE_STRING    example string   <string>          ✓ set to "hello, world!"`,
            `❯ AUSTENITE_XTRIGGER  trigger failure  <string>          ✗ undefined`,
            ``,
          ].join(EOL)
        );
      });

      it("exits the process with a non-zero exit code", () => {
        expect(exitCode).toBeDefined();
        expect(exitCode).toBeGreaterThan(0);
      });
    });
  });
});
