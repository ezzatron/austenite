import { boolean } from "../../src/boolean";
import { Declaration, Options } from "../../src/declaration";
import { duration } from "../../src/duration";
import { initialize, reset, setProcessExit } from "../../src/environment";
import { kubernetesAddress } from "../../src/kubernetes-address";
import { string } from "../../src/string";
import { Results } from "../../src/validation";
import { UndefinedError } from "../../src/variable";
import { createMockConsole, MockConsole } from "../helpers";

type DeclarationFactory = (
  options?: Options<unknown>
) => Declaration<unknown, Options<unknown>>;

const booleanFactory = boolean.bind(null, "AUSTENITE_VAR", "<description>");
const durationFactory = duration.bind(null, "AUSTENITE_VAR", "<description>");
const k8sAddressFactory = kubernetesAddress.bind(null, "austenite-svc");
const stringFactory = string.bind(null, "AUSTENITE_VAR", "<description>");

describe("initialize()", () => {
  let exitCode: number | undefined;
  let env: typeof process.env;
  let mockConsole: MockConsole;

  function processExit(code: number): never {
    exitCode = code;

    return undefined as never;
  }

  beforeEach(() => {
    exitCode = undefined;
    setProcessExit(processExit);

    env = process.env;
    process.env = { ...env };

    mockConsole = createMockConsole();
  });

  afterEach(() => {
    jest.resetAllMocks();
    process.env = env;
    reset();
  });

  describe("when the environment is valid", () => {
    describe("before being called", () => {
      it.each`
        type                    | factory
        ${"boolean"}            | ${booleanFactory}
        ${"duration"}           | ${durationFactory}
        ${"kubernetes address"} | ${k8sAddressFactory}
        ${"string"}             | ${stringFactory}
      `(
        "prevents access to $type values",
        ({ factory }: { factory: DeclarationFactory }) => {
          const declaration = factory({
            default: undefined,
          });

          expect(() => {
            declaration.value();
          }).toThrow("can not be read until the environment is initialized");
        }
      );
    });

    describe("after being called", () => {
      let declaration: Declaration<string, Options<string>>;

      beforeEach(() => {
        declaration = string("AUSTENITE_VAR", "<description>", {
          default: undefined,
        });

        initialize();
      });

      it("allows access to values", () => {
        expect(() => {
          declaration.value();
        }).not.toThrow();
      });

      it.each`
        type                    | factory
        ${"boolean"}            | ${booleanFactory}
        ${"duration"}           | ${durationFactory}
        ${"kubernetes address"} | ${k8sAddressFactory}
        ${"string"}             | ${stringFactory}
      `(
        "prevents additional $type declarations",
        ({ factory }: { factory: DeclarationFactory }) => {
          expect(() => {
            factory();
          }).toThrow("can not be defined after the environment is initialized");
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

    describe("when a custom invalid environment handler is specified", () => {
      let onInvalid: jest.Mock;

      beforeEach(() => {
        onInvalid = jest.fn();
      });

      it("does not call the handler", () => {
        initialize({ onInvalid });

        expect(onInvalid).not.toHaveBeenCalled();
      });
    });
  });

  describe("when the environment is invalid", () => {
    describe("before being called", () => {
      it.each`
        type                    | factory
        ${"boolean"}            | ${booleanFactory}
        ${"duration"}           | ${durationFactory}
        ${"kubernetes address"} | ${k8sAddressFactory}
        ${"string"}             | ${stringFactory}
      `(
        "prevents access to $type values",
        ({ factory }: { factory: DeclarationFactory }) => {
          const declaration = factory();

          expect(() => {
            declaration.value();
          }).toThrow("can not be read until the environment is initialized");
        }
      );
    });

    describe("when called", () => {
      beforeEach(() => {
        string("AUSTENITE_STRING", "example string");
        boolean("AUSTENITE_BOOLEAN", "example boolean");

        initialize();
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

      beforeEach(() => {
        process.env.AUSTENITE_BOOLEAN = "true";

        string("AUSTENITE_STRING", "example string");
        boolean("AUSTENITE_BOOLEAN", "example boolean");

        results = undefined;

        initialize({
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
              error: new UndefinedError("AUSTENITE_STRING"),
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
