import { describe, expectTypeOf, it } from "vitest";
import { bigInteger, initialize } from "../../../src/index.js";
import { noop } from "../../helpers.js";

describe("Big integer declarations", () => {
  describe("when the declaration is required", () => {
    describe(".value()", () => {
      it("returns a bigint value", () => {
        const declaration = bigInteger("AUSTENITE_INTEGER", "<description>");

        process.env.AUSTENITE_INTEGER = "123456";
        initialize({ onInvalid: noop });
        const actual = declaration.value();

        expectTypeOf(actual).toEqualTypeOf<bigint>();
      });
    });
  });

  describe("when the declaration is optional", () => {
    describe(".value()", () => {
      it("returns an optional bigint value", () => {
        const declaration = bigInteger("AUSTENITE_INTEGER", "<description>", {
          default: undefined,
        });

        initialize({ onInvalid: noop });
        const actual = declaration.value();

        expectTypeOf(actual).toEqualTypeOf<bigint | undefined>();
      });
    });
  });
});