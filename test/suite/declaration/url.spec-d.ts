import { describe, expectTypeOf, it } from "vitest";
import { initialize, url } from "../../../src/index.js";
import { noop } from "../../helpers.js";

describe("URL declarations", () => {
  describe("when the declaration is required", () => {
    describe(".value()", () => {
      it("returns a URL value", () => {
        const declaration = url("AUSTENITE_URL", "<description>");

        process.env.AUSTENITE_URL = "https://host.example.org/path/to/resource";
        initialize({ onInvalid: noop });
        const actual = declaration.value();

        expectTypeOf(actual).toEqualTypeOf<URL>();
      });
    });
  });

  describe("when the declaration is optional", () => {
    describe(".value()", () => {
      it("returns an optional URL value", () => {
        const declaration = url("AUSTENITE_URL", "<description>", {
          default: undefined,
        });

        initialize({ onInvalid: noop });
        const actual = declaration.value();

        expectTypeOf(actual).toEqualTypeOf<URL | undefined>();
      });
    });
  });
});
