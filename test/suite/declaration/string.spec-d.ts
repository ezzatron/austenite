import { string, type Declaration } from "austenite";
import { initialize } from "austenite/node";
import { describe, expectTypeOf, it } from "vitest";
import { noop } from "../../helpers.js";

describe("String declarations", () => {
  describe("when the declaration is required", () => {
    it("returns a required string declaration", () => {
      const declaration = string("AUSTENITE_STRING", "<description>");

      expectTypeOf(declaration).toEqualTypeOf<Declaration<string>>();
    });

    describe(".value()", () => {
      it("returns a string value", async () => {
        const declaration = string("AUSTENITE_STRING", "<description>");

        process.env.AUSTENITE_STRING = "<value>";
        await initialize({ onInvalid: noop });
        const actual = declaration.value();

        expectTypeOf(actual).toEqualTypeOf<string>();
      });
    });
  });

  describe("when the declaration is optional", () => {
    it("returns an optional string declaration", () => {
      const declaration = string("AUSTENITE_STRING", "<description>", {
        default: undefined,
      });

      expectTypeOf(declaration).toEqualTypeOf<
        Declaration<string | undefined>
      >();
    });

    describe(".value()", () => {
      it("returns an optional string value", async () => {
        const declaration = string("AUSTENITE_STRING", "<description>", {
          default: undefined,
        });

        await initialize({ onInvalid: noop });
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
