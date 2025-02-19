import { Temporal } from "@js-temporal/polyfill";
import { duration, type Declaration } from "austenite";
import { initialize } from "austenite/node";
import { describe, expectTypeOf, it } from "vitest";
import { noop } from "../../helpers.js";

const { Duration } = Temporal;
type Duration = Temporal.Duration;

describe("Duration declarations", () => {
  describe("when the declaration is required", () => {
    it("returns a required Duration declaration", () => {
      const declaration = duration("AUSTENITE_DURATION", "<description>");

      expectTypeOf(declaration).toEqualTypeOf<Declaration<Duration>>();
    });

    describe(".value()", () => {
      it("returns a Duration value", async () => {
        const declaration = duration("AUSTENITE_DURATION", "<description>");

        process.env.AUSTENITE_DURATION = "P1Y";
        await initialize({ onInvalid: noop });
        const actual = declaration.value();

        expectTypeOf(actual).toEqualTypeOf<Duration>();
      });
    });
  });

  describe("when the declaration is optional", () => {
    it("returns an optional Duration declaration", () => {
      const declaration = duration("AUSTENITE_DURATION", "<description>", {
        default: undefined,
      });

      expectTypeOf(declaration).toEqualTypeOf<
        Declaration<Duration | undefined>
      >();
    });

    describe(".value()", () => {
      it("returns an optional Duration value", async () => {
        const declaration = duration("AUSTENITE_DURATION", "<description>", {
          default: undefined,
        });

        await initialize({ onInvalid: noop });
        const actual = declaration.value();

        expectTypeOf(actual).toEqualTypeOf<Duration | undefined>();
      });
    });
  });

  describe("when valid options are specified", () => {
    it("does not allow unknown options", () => {
      const declaration = duration(
        "AUSTENITE_DURATION",
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
