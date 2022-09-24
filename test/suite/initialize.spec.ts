import { boolean, string } from "../../src";
import { initialize, reset } from "../../src/environment";
import { Options } from "../../src/options";
import { Variable } from "../../src/variable";

type VariableFactory = (
  name: string,
  description: string,
  options: Options<unknown> | undefined
) => Variable<unknown, Options<unknown>>;

describe("initialize()", () => {
  let env: typeof process.env;

  beforeEach(() => {
    env = process.env;
    process.env = { ...env };
    reset();
  });

  afterEach(() => {
    process.env = env;
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
      beforeEach(() => {
        initialize();
      });

      it("allows access to values", () => {
        const variable = string("AUSTENITE_VAR", "<description>", {
          required: false,
        });

        expect(() => {
          variable.value();
        }).not.toThrow();
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

    describe("after being called", () => {
      beforeEach(() => {
        initialize();
      });

      it("allows access to errors about the invalid environment", () => {
        const variable = string("AUSTENITE_VAR", "<description>", {
          required: true,
        });

        expect(() => {
          variable.value();
        }).toThrow(
          "AUSTENITE_VAR is undefined and does not have a default value."
        );
      });
    });
  });
});
