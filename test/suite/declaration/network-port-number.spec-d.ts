import { networkPortNumber, type Declaration } from "austenite";
import { initialize } from "austenite/node";
import { describe, expectTypeOf, it } from "vitest";
import { noop } from "../../helpers.js";

describe("Network port number declarations", () => {
  describe("when the declaration is required", () => {
    it("returns a required number declaration", () => {
      const declaration = networkPortNumber("AUSTENITE_PORT", "<description>");

      expectTypeOf(declaration).toEqualTypeOf<Declaration<number>>();
    });

    describe(".value()", () => {
      it("returns a number value", async () => {
        const declaration = networkPortNumber(
          "AUSTENITE_PORT",
          "<description>",
        );

        process.env.AUSTENITE_PORT = "12345";
        await initialize({ onInvalid: noop });
        const actual = declaration.value();

        expectTypeOf(actual).toEqualTypeOf<number>();
      });
    });
  });

  describe("when the declaration is optional", () => {
    it("returns an optional number declaration", () => {
      const declaration = networkPortNumber("AUSTENITE_PORT", "<description>", {
        default: undefined,
      });

      expectTypeOf(declaration).toEqualTypeOf<
        Declaration<number | undefined>
      >();
    });

    describe(".value()", () => {
      it("returns an optional number value", async () => {
        const declaration = networkPortNumber(
          "AUSTENITE_PORT",
          "<description>",
          {
            default: undefined,
          },
        );

        await initialize({ onInvalid: noop });
        const actual = declaration.value();

        expectTypeOf(actual).toEqualTypeOf<number | undefined>();
      });
    });
  });

  describe("when valid options are specified", () => {
    it("does not allow unknown options", () => {
      const declaration = networkPortNumber(
        "AUSTENITE_PORT",
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
