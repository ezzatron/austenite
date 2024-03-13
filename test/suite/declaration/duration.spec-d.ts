import { Temporal } from "@js-temporal/polyfill";
import { describe, expectTypeOf, it } from "vitest";
import { duration, initialize } from "../../../src/index.js";
import { noop } from "../../helpers.js";

const { Duration } = Temporal;
type Duration = Temporal.Duration;

describe("Duration declarations", () => {
  describe("when the declaration is required", () => {
    describe(".value()", () => {
      it("returns a Duration value", () => {
        const declaration = duration("AUSTENITE_DURATION", "<description>");

        process.env.AUSTENITE_DURATION = "P1Y";
        initialize({ onInvalid: noop });
        const actual = declaration.value();

        expectTypeOf(actual).toEqualTypeOf<Duration>();
      });
    });
  });

  describe("when the declaration is optional", () => {
    describe(".value()", () => {
      it("returns an optional Duration value", () => {
        const declaration = duration("AUSTENITE_DURATION", "<description>", {
          default: undefined,
        });

        initialize({ onInvalid: noop });
        const actual = declaration.value();

        expectTypeOf(actual).toEqualTypeOf<Duration | undefined>();
      });
    });
  });
});
