import { describe, expectTypeOf, it } from "vitest";
import { url } from "../../../src/index.js";
import { initialize } from "../../../src/node.js";
import { noop } from "../../helpers.js";

describe("URL declarations", () => {
  describe("when the declaration is required", () => {
    describe(".value()", () => {
      it("returns a URL value", async () => {
        const declaration = url("AUSTENITE_URL", "<description>");

        process.env.AUSTENITE_URL = "https://host.example.org/path/to/resource";
        await initialize({ onInvalid: noop });
        const actual = declaration.value();

        expectTypeOf(actual).toEqualTypeOf<URL>();
      });
    });
  });

  describe("when the declaration is optional", () => {
    describe(".value()", () => {
      it("returns an optional URL value", async () => {
        const declaration = url("AUSTENITE_URL", "<description>", {
          default: undefined,
        });

        await initialize({ onInvalid: noop });
        const actual = declaration.value();

        expectTypeOf(actual).toEqualTypeOf<URL | undefined>();
      });
    });
  });

  describe("when valid options are specified", () => {
    it("does not allow unknown options", () => {
      const declaration = url(
        "AUSTENITE_URL",
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
