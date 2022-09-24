import { boolean, string } from "../../src";
import { reset } from "../../src/environment";
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
    it.each`
      type         | factory
      ${"boolean"} | ${boolean}
      ${"string"}  | ${string}
    `(
      "prevents access to $type values until called",
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

  describe("when the environment is invalid", () => {
    it.each`
      type         | factory
      ${"boolean"} | ${boolean}
      ${"string"}  | ${string}
    `(
      "prevents access to $type values until called",
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
});
