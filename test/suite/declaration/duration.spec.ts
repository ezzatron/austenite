import { Temporal } from "@js-temporal/polyfill";
import { Declaration } from "../../../src/declaration.js";
import { Options } from "../../../src/declaration/duration.js";
import { duration, initialize } from "../../../src/index.js";
import { hasType, noop } from "../../helpers.js";

const { Duration } = Temporal;
type Duration = Temporal.Duration;

const invalidValueTable = [
  [
    "bare number",
    "1",
    "value of AUSTENITE_DURATION (1) is invalid: must be an ISO 8601 duration",
  ],
  [
    "missing units",
    "P1",
    "value of AUSTENITE_DURATION (P1) is invalid: must be an ISO 8601 duration",
  ],
  [
    "missing time units",
    "PT1",
    "value of AUSTENITE_DURATION (PT1) is invalid: must be an ISO 8601 duration",
  ],
  [
    "unknown units",
    "P1Q",
    "value of AUSTENITE_DURATION (P1Q) is invalid: must be an ISO 8601 duration",
  ],
  [
    "unknown time units",
    "PT1Q",
    "value of AUSTENITE_DURATION (PT1Q) is invalid: must be an ISO 8601 duration",
  ],
];

describe("Duration declarations", () => {
  let declaration: Declaration<Duration, Options>;

  describe("when no options are supplied", () => {
    beforeEach(() => {
      declaration = duration("AUSTENITE_DURATION", "<description>");

      initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow(
        "AUSTENITE_DURATION is undefined and does not have a default value"
      );
    });
  });

  describe("when empty options are supplied", () => {
    beforeEach(() => {
      declaration = duration("AUSTENITE_DURATION", "<description>", {});

      initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow(
        "AUSTENITE_DURATION is undefined and does not have a default value"
      );
    });
  });

  describe("when the declaration is required", () => {
    beforeEach(() => {
      declaration = duration("AUSTENITE_DURATION", "<description>");
    });

    describe(".value()", () => {
      it("returns a Duration value", () => {
        // this test is weird because it tests type inference
        const declaration = duration("AUSTENITE_DURATION", "<description>");

        process.env.AUSTENITE_DURATION = "P1Y";
        initialize({ onInvalid: noop });
        const actual = declaration.value();

        expect(hasType<Duration, typeof actual>(actual)).toBeNull();
      });
    });

    describe("when the value is a valid duration", () => {
      beforeEach(() => {
        process.env.AUSTENITE_DURATION = "P1Y";

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value()).toEqual(new Duration(1));
        });

        it("returns the same value when called multiple times", () => {
          expect(declaration.value()).toEqual(new Duration(1));
          expect(declaration.value()).toEqual(new Duration(1));
        });
      });
    });

    describe.each(invalidValueTable)(
      "when the value is invalid (%s)",
      (_, duration: string, expected: string) => {
        beforeEach(() => {
          process.env.AUSTENITE_DURATION = duration;

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => {
              declaration.value();
            }).toThrow(expected);
          });
        });
      }
    );

    describe("when the value is empty", () => {
      beforeEach(() => {
        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "AUSTENITE_DURATION is undefined and does not have a default value"
          );
        });
      });
    });
  });

  describe("when the declaration is optional", () => {
    beforeEach(() => {
      declaration = duration("AUSTENITE_DURATION", "<description>", {
        default: undefined,
      });
    });

    describe(".value()", () => {
      it("returns an optional Duration value", () => {
        // this test is weird because it tests type inference
        const declaration = duration("AUSTENITE_DURATION", "<description>", {
          default: undefined,
        });

        initialize({ onInvalid: noop });
        const actual = declaration.value();

        expect(hasType<Duration | undefined, typeof actual>(actual)).toBeNull();
      });
    });

    describe("when the value is a valid duration", () => {
      beforeEach(() => {
        process.env.AUSTENITE_DURATION = "P1Y";

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value()).toEqual(new Duration(1));
        });
      });
    });

    describe.each(invalidValueTable)(
      "when the value is invalid (%s)",
      (_, duration: string, expected: string) => {
        beforeEach(() => {
          process.env.AUSTENITE_DURATION = duration;

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => {
              declaration.value();
            }).toThrow(expected);
          });
        });
      }
    );

    describe("when the value is empty", () => {
      describe("when there is a default value", () => {
        beforeEach(() => {
          declaration = duration("AUSTENITE_DURATION", "<description>", {
            default: Duration.from("P2D"),
          });

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the default", () => {
            expect(declaration.value()).toEqual(Duration.from("P2D"));
          });
        });
      });

      describe("when there is no default value", () => {
        beforeEach(() => {
          declaration = duration("AUSTENITE_DURATION", "<description>", {
            default: undefined,
          });

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns undefined", () => {
            expect(declaration.value()).toBeUndefined();
          });
        });
      });
    });
  });
});
