import { Buffer } from "node:buffer";
import { describe, expectTypeOf, it } from "vitest";
import { binary } from "../../../src/index.js";
import { initialize } from "../../../src/node.js";
import { noop } from "../../helpers.js";

describe("Binary declarations", () => {
  describe("when the declaration is required", () => {
    describe(".value()", () => {
      it("returns a Buffer value", async () => {
        const declaration = binary("AUSTENITE_BINARY", "<description>");

        process.env.AUSTENITE_BINARY = "bGlnaHQgd29y";
        await initialize({ onInvalid: noop });
        const actual = declaration.value();

        expectTypeOf(actual).toEqualTypeOf<Buffer>();
      });
    });
  });

  describe("when the declaration is optional", () => {
    describe(".value()", () => {
      it("returns an optional Binary value", async () => {
        const declaration = binary("AUSTENITE_BINARY", "<description>", {
          default: undefined,
        });

        await initialize({ onInvalid: noop });
        const actual = declaration.value();

        expectTypeOf(actual).toEqualTypeOf<Buffer | undefined>();
      });
    });
  });

  describe("when valid options are specified", () => {
    it("does not allow unknown options", () => {
      const declaration = binary(
        "AUSTENITE_BINARY",
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
