import { jest } from "@jest/globals";
import { Declaration, Options } from "../../src/declaration.js";
import { Options as EnumerationOptions } from "../../src/declaration/enumeration.js";
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
import { Results } from "../../src/validation.js";
import { UndefinedError } from "../../src/variable.js";
import { createMockConsole, MockConsole } from "../helpers.js";

type DeclarationFactory = (
  options?: Options<unknown>
) => Declaration<unknown, Options<unknown>>;

const bigIntegerFactory = bigInteger.bind(
  null,
  "AUSTENITE_VAR",
  "<description>"
);
const booleanFactory = boolean.bind(null, "AUSTENITE_VAR", "<description>");
const durationFactory = duration.bind(null, "AUSTENITE_VAR", "<description>");
const enumerationFactory = (options: EnumerationOptions<0 | 1>) =>
  enumeration(
    "AUSTENITE_VAR",
    "<description>",
    {
      "<member-0>": {
        value: 0,
        description: "member 0",
      },
      "<member-1>": {
        value: 1,
        description: "member 1",
      },
    } as const,
    options
  );
const integerFactory = integer.bind(null, "AUSTENITE_VAR", "<description>");
const k8sAddressFactory = kubernetesAddress.bind(null, "austenite-svc");
const numberFactory = number.bind(null, "AUSTENITE_VAR", "<description>");
const stringFactory = string.bind(null, "AUSTENITE_VAR", "<description>");
const urlFactory = url.bind(null, "AUSTENITE_VAR", "<description>");

describe("initialize()", () => {
  let exitCode: number | undefined;
  let mockConsole: MockConsole;

  beforeEach(() => {
    exitCode = undefined;
    jest.spyOn(process, "exit").mockImplementation((code) => {
      exitCode = code ?? 0;

      return undefined as never;
    });

    mockConsole = createMockConsole();
  });

  describe("when the environment is valid", () => {
    describe("before being called", () => {
      it.each`
        type                    | factory
        ${"big integer"}        | ${bigIntegerFactory}
        ${"boolean"}            | ${booleanFactory}
        ${"duration"}           | ${durationFactory}
        ${"enumeration"}        | ${enumerationFactory}
        ${"integer"}            | ${integerFactory}
        ${"Kubernetes address"} | ${k8sAddressFactory}
        ${"number"}             | ${numberFactory}
        ${"string"}             | ${stringFactory}
        ${"URL"}                | ${urlFactory}
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
        ${"big integer"}        | ${bigIntegerFactory}
        ${"boolean"}            | ${booleanFactory}
        ${"duration"}           | ${durationFactory}
        ${"enumeration"}        | ${enumerationFactory}
        ${"integer"}            | ${integerFactory}
        ${"Kubernetes address"} | ${k8sAddressFactory}
        ${"number"}             | ${numberFactory}
        ${"string"}             | ${stringFactory}
        ${"URL"}                | ${urlFactory}
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
        ${"big integer"}        | ${bigIntegerFactory}
        ${"boolean"}            | ${booleanFactory}
        ${"duration"}           | ${durationFactory}
        ${"enumeration"}        | ${enumerationFactory}
        ${"integer"}            | ${integerFactory}
        ${"Kubernetes address"} | ${k8sAddressFactory}
        ${"number"}             | ${numberFactory}
        ${"string"}             | ${stringFactory}
        ${"URL"}                | ${urlFactory}
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
