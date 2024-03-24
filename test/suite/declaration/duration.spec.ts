import { Temporal } from "@js-temporal/polyfill";
import { beforeEach, describe, expect, it } from "vitest";
import { Declaration } from "../../../src/declaration.js";
import { Options } from "../../../src/declaration/duration.js";
import { duration, initialize } from "../../../src/index.js";
import { noop } from "../../helpers.js";

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
        "AUSTENITE_DURATION is not set and does not have a default value",
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
        "AUSTENITE_DURATION is not set and does not have a default value",
      );
    });
  });

  describe("when the declaration is required", () => {
    beforeEach(() => {
      declaration = duration("AUSTENITE_DURATION", "<description>");
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
      },
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
            "AUSTENITE_DURATION is not set and does not have a default value",
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
      },
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

  describe("when the declaration has constraints", () => {
    beforeEach(() => {
      declaration = duration("AUSTENITE_DURATION", "<description>", {
        constraints: [
          {
            description: "<constraint A>",
            constrain: (v) => v.days % 2 === 0 || "days must be divisible by 2",
          },
          {
            description: "<constraint B>",
            constrain: (v) => v.days % 3 === 0 || "days must be divisible by 3",
          },
        ],
        examples: [{ value: Duration.from("P6D"), label: "example" }],
      });
    });

    describe("when the value satisfies the constraints", () => {
      beforeEach(() => {
        process.env.AUSTENITE_DURATION = "P6D";

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value()).toEqual(Duration.from("P6D"));
        });
      });
    });

    describe("when the value violates the first constraint", () => {
      beforeEach(() => {
        process.env.AUSTENITE_DURATION = "P3D";

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_DURATION (P3D) is invalid: days must be divisible by 2",
          );
        });
      });
    });

    describe("when the value violates the second constraint", () => {
      beforeEach(() => {
        process.env.AUSTENITE_DURATION = "P2D";

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_DURATION (P2D) is invalid: days must be divisible by 3",
          );
        });
      });
    });
  });

  describe("when the declaration has the constraints from the README", () => {
    beforeEach(() => {
      declaration = duration("GRPC_TIMEOUT", "gRPC request timeout", {
        constraints: [
          {
            description: "must be a multiple of 100 milliseconds",
            constrain: (v) =>
              v.milliseconds % 100 === 0 ||
              "must be a multiple of 100 milliseconds",
          },
        ],
        examples: [
          {
            value: Temporal.Duration.from({ milliseconds: 100 }),
            label: "100 milliseconds",
          },
        ],
      });
    });

    describe("when the value satisfies the constraints", () => {
      beforeEach(() => {
        process.env.GRPC_TIMEOUT = "PT1S";

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value()).toEqual(Duration.from("PT1S"));
        });
      });
    });

    describe("when the value violates the constraints", () => {
      beforeEach(() => {
        process.env.GRPC_TIMEOUT = "PT0.01S";

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of GRPC_TIMEOUT (PT0.01S) is invalid: must be a multiple of 100 milliseconds",
          );
        });
      });
    });
  });
});
