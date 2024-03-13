import { beforeEach, describe, expect, it } from "vitest";
import { Declaration } from "../../../src/declaration.js";
import { Options } from "../../../src/declaration/number.js";
import { initialize, number } from "../../../src/index.js";
import { hasType, noop } from "../../helpers.js";

const validValueTable = [
  ["zero", "0.0", 0],
  ["positive zero", "+0.0", 0],
  ["negative zero", "-0.0", -0],
  ["positive", "123.456", 123.456],
  ["explicit positive", "+123.456", 123.456],
  ["negative", "-123.456", -123.456],
  ["exponential", "1.23456e+2", 123.456],
  ["octal", "0o361100", 123456],
  ["hexadecimal", "0x1E240", 123456],
  ["binary", "0b11110001001000000", 123456],
] as const;

const invalidValueTable = [
  [
    "non-numeric",
    "a",
    "value of AUSTENITE_NUMBER (a) is invalid: must be numeric",
  ],
  [
    "too many decimal places",
    "1.2.3",
    "value of AUSTENITE_NUMBER (1.2.3) is invalid: must be numeric",
  ],
  [
    "contains whitespace",
    "1 .2",
    "value of AUSTENITE_NUMBER ('1 .2') is invalid: must be numeric",
  ],
];

describe("Number declarations", () => {
  let declaration: Declaration<number, Options>;

  describe("when no options are supplied", () => {
    beforeEach(() => {
      declaration = number("AUSTENITE_NUMBER", "<description>");

      initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow(
        "AUSTENITE_NUMBER is undefined and does not have a default value",
      );
    });
  });

  describe("when empty options are supplied", () => {
    beforeEach(() => {
      declaration = number("AUSTENITE_NUMBER", "<description>", {});

      initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow(
        "AUSTENITE_NUMBER is undefined and does not have a default value",
      );
    });
  });

  describe("when the declaration is required", () => {
    beforeEach(() => {
      declaration = number("AUSTENITE_NUMBER", "<description>");
    });

    describe(".value()", () => {
      it("returns a number value", () => {
        // this test is weird because it tests type inference
        const declaration = number("AUSTENITE_NUMBER", "<description>");

        process.env.AUSTENITE_NUMBER = "123.456";
        initialize({ onInvalid: noop });
        const actual = declaration.value();

        expect(hasType<number, typeof actual>(actual)).toBeNull();
      });
    });

    describe.each(validValueTable)(
      "when the value is valid (%s)",
      (_, number: string, expected: number) => {
        beforeEach(() => {
          process.env.AUSTENITE_NUMBER = number;

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value", () => {
            expect(declaration.value()).toEqual(expected);
          });

          it("returns the same value when called multiple times", () => {
            expect(declaration.value()).toEqual(expected);
            expect(declaration.value()).toEqual(expected);
          });
        });
      },
    );

    describe.each(invalidValueTable)(
      "when the value is invalid (%s)",
      (_, number: string, expected: string) => {
        beforeEach(() => {
          process.env.AUSTENITE_NUMBER = number;

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
            "AUSTENITE_NUMBER is undefined and does not have a default value",
          );
        });
      });
    });
  });

  describe("when the declaration is optional", () => {
    beforeEach(() => {
      declaration = number("AUSTENITE_NUMBER", "<description>", {
        default: undefined,
      });
    });

    describe(".value()", () => {
      it("returns an optional number value", () => {
        // this test is weird because it tests type inference
        const declaration = number("AUSTENITE_NUMBER", "<description>", {
          default: undefined,
        });

        initialize({ onInvalid: noop });
        const actual = declaration.value();

        expect(hasType<number | undefined, typeof actual>(actual)).toBeNull();
      });
    });

    describe.each(validValueTable)(
      "when the value is valid (%s)",
      (_, number: string, expected: number) => {
        beforeEach(() => {
          process.env.AUSTENITE_NUMBER = number;

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value", () => {
            expect(declaration.value()).toEqual(expected);
          });
        });
      },
    );

    describe.each(invalidValueTable)(
      "when the value is invalid (%s)",
      (_, number: string, expected: string) => {
        beforeEach(() => {
          process.env.AUSTENITE_NUMBER = number;

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
          declaration = number("AUSTENITE_NUMBER", "<description>", {
            default: -123.456,
          });

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the default", () => {
            expect(declaration.value()).toBe(-123.456);
          });
        });
      });

      describe("when there is no default value", () => {
        beforeEach(() => {
          declaration = number("AUSTENITE_NUMBER", "<description>", {
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
