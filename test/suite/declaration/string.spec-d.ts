import { describe, expectTypeOf, it } from "vitest";
import { initialize, string } from "../../../src/index.js";
import { noop } from "../../helpers.js";

describe("String declarations", () => {
  describe("when the declaration is required", () => {
    describe(".value()", () => {
      it("returns a string value", () => {
        const declaration = string("AUSTENITE_STRING", "<description>");

        process.env.AUSTENITE_STRING = "<value>";
        initialize({ onInvalid: noop });
        const actual = declaration.value();

        expectTypeOf(actual).toEqualTypeOf<string>();
      });
    });
  });

  describe("when the declaration is optional", () => {
    describe(".value()", () => {
      it("returns an optional string value", () => {
        const declaration = string("AUSTENITE_STRING", "<description>", {
          default: undefined,
        });

        initialize({ onInvalid: noop });
        const actual = declaration.value();

        expectTypeOf(actual).toEqualTypeOf<string | undefined>();
      });
    });
  });

  describe("when valid options are specified", () => {
    it("does not allow unknown options", () => {
      const declaration = string(
        "AUSTENITE_STRING",
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
