import { boolean, string } from "austenite";
import { OnInvalid, initialize } from "austenite/node";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { DeclarationFromOptions, Options } from "../../src/declaration.js";
import { NotSetError } from "../../src/error.js";
import { Results } from "../../src/validation.js";
import { MockConsole, createMockConsole } from "../helpers.js";

describe("initialize()", () => {
  let exitCode: number | undefined;
  let mockConsole: MockConsole;

  beforeEach(() => {
    exitCode = undefined;
    vi.spyOn(process, "exit").mockImplementation((code) => {
      exitCode = (code ?? 0) as number;

      return undefined as never;
    });

    mockConsole = createMockConsole();
  });

  describe("when the environment is valid", () => {
    describe("after being called", () => {
      let declaration: DeclarationFromOptions<string, Options<string>>;

      beforeEach(async () => {
        declaration = string("AUSTENITE_VAR", "<description>", {
          default: undefined,
        });

        await initialize();
      });

      it("allows access to values", () => {
        expect(() => {
          declaration.value();
        }).not.toThrow();
      });

      describe("when called again", () => {
        it("does nothing", async () => {
          await expect(initialize()).resolves.not.toThrow();
        });
      });
    });

    describe("when a custom invalid environment handler is specified", () => {
      let onInvalid: Mock<OnInvalid>;

      beforeEach(() => {
        onInvalid = vi.fn();
      });

      it("does not call the handler", async () => {
        await initialize({ onInvalid });

        expect(onInvalid).not.toHaveBeenCalled();
      });
    });
  });

  describe("when the environment is invalid", () => {
    describe("when called", () => {
      beforeEach(async () => {
        string("AUSTENITE_STRING", "example string");
        boolean("AUSTENITE_BOOLEAN", "example boolean");

        await initialize();
      });

      it("outputs a summary table", () => {
        const actual = mockConsole.readStderr();

        expect(actual).toContain("AUSTENITE_BOOLEAN");
        expect(actual).toContain("AUSTENITE_STRING");
      });

      it("exits the process with a non-zero exit code", () => {
        expect(exitCode).toBeDefined();
        expect(exitCode).toBeGreaterThan(0);
      });
    });

    describe("when a custom invalid environment handler is specified", () => {
      let results: Results | undefined;
      let defaultHandler: () => unknown;

      beforeEach(async () => {
        process.env.AUSTENITE_BOOLEAN = "true";

        string("AUSTENITE_STRING", "example string");
        boolean("AUSTENITE_BOOLEAN", "example boolean");

        results = undefined;

        await initialize({
          onInvalid(args) {
            results = args.results;
            defaultHandler = args.defaultHandler;
          },
        });
      });

      it("prevents outputting the summary table", () => {
        expect(mockConsole.readStderr()).toBe("");
      });

      it("prevents exiting the process", () => {
        expect(exitCode).toBeUndefined();
      });

      it("provides a result set", () => {
        expect(results).toMatchObject([
          {
            variable: {
              spec: {
                name: "AUSTENITE_BOOLEAN",
              },
            },
            result: {
              maybe: {
                isDefined: true,
                value: {
                  native: true,
                  verbatim: "true",
                  isDefault: false,
                },
              },
            },
          },
          {
            variable: {
              spec: {
                name: "AUSTENITE_STRING",
              },
            },
            result: {
              error: new NotSetError("AUSTENITE_STRING"),
            },
          },
        ]);
      });

      it("provides a default handler function", () => {
        expect(typeof defaultHandler).toBe("function");
      });

      describe("when the default handler is called", () => {
        beforeEach(() => {
          defaultHandler();
        });

        it("outputs a summary table", () => {
          const actual = mockConsole.readStderr();

          expect(actual).toContain("AUSTENITE_BOOLEAN");
          expect(actual).toContain("AUSTENITE_STRING");
        });

        it("exits the process with a non-zero exit code", () => {
          expect(exitCode).toBeDefined();
          expect(exitCode).toBeGreaterThan(0);
        });
      });
    });
  });
});
