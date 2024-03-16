import { describe, expectTypeOf, it } from "vitest";
import { initialize, networkPortNumber } from "../../../src/index.js";
import { noop } from "../../helpers.js";

describe("Network port number declarations", () => {
  describe("when the declaration is required", () => {
    describe(".value()", () => {
      it("returns a number value", () => {
        const declaration = networkPortNumber(
          "AUSTENITE_PORT",
          "<description>",
        );

        process.env.AUSTENITE_PORT = "12345";
        initialize({ onInvalid: noop });
        const actual = declaration.value();

        expectTypeOf(actual).toEqualTypeOf<number>();
      });
    });
  });

  describe("when the declaration is optional", () => {
    describe(".value()", () => {
      it("returns an optional number value", () => {
        const declaration = networkPortNumber(
          "AUSTENITE_PORT",
          "<description>",
          {
            default: undefined,
          },
        );

        initialize({ onInvalid: noop });
        const actual = declaration.value();

        expectTypeOf(actual).toEqualTypeOf<number | undefined>();
      });
    });
  });
});