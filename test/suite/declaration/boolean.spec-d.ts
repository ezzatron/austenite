import { describe, expectTypeOf, it } from "vitest";
import { boolean, initialize } from "../../../src/index.js";
import { noop } from "../../helpers.js";

describe("Boolean declarations", () => {
  describe("when the declaration is required", () => {
    describe(".value()", () => {
      it("returns a boolean value", () => {
        const declaration = boolean("AUSTENITE_BOOLEAN", "<description>");

        process.env.AUSTENITE_BOOLEAN = "false";
        initialize({ onInvalid: noop });
        const actual = declaration.value();

        expectTypeOf(actual).toEqualTypeOf<boolean>();
      });
    });
  });

  describe("when the declaration is optional", () => {
    describe(".value()", () => {
      it("returns an optional boolean value", () => {
        const declaration = boolean("AUSTENITE_BOOLEAN", "<description>", {
          default: undefined,
        });

        initialize({ onInvalid: noop });
        const actual = declaration.value();

        expectTypeOf(actual).toEqualTypeOf<boolean | undefined>();
      });
    });
  });

  describe("when valid options are specified", () => {
    it("does not allow unknown options", () => {
      const declaration = boolean(
        "AUSTENITE_BOOLEAN",
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
