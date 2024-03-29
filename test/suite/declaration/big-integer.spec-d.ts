import { describe, expectTypeOf, it } from "vitest";
import { bigInteger, initialize } from "../../../src/index.js";
import { noop } from "../../helpers.js";

describe("Big integer declarations", () => {
  describe("when the declaration is required", () => {
    describe(".value()", () => {
      it("returns a bigint value", async () => {
        const declaration = bigInteger("AUSTENITE_INTEGER", "<description>");

        process.env.AUSTENITE_INTEGER = "123456";
        await initialize({ onInvalid: noop });
        const actual = declaration.value();

        expectTypeOf(actual).toEqualTypeOf<bigint>();
      });
    });
  });

  describe("when the declaration is optional", () => {
    describe(".value()", () => {
      it("returns an optional bigint value", async () => {
        const declaration = bigInteger("AUSTENITE_INTEGER", "<description>", {
          default: undefined,
        });

        await initialize({ onInvalid: noop });
        const actual = declaration.value();

        expectTypeOf(actual).toEqualTypeOf<bigint | undefined>();
      });
    });
  });

  describe("when valid options are specified", () => {
    it("does not allow unknown options", () => {
      const declaration = bigInteger(
        "AUSTENITE_INTEGER",
        "<description>",
        // @ts-expect-error - unknown option
        {
          default: undefined,
          unknown: "unknown",
        },
      );

      expectTypeOf(declaration).toBeObject();
    });
  });
});
