import { number } from "austenite";
import { initialize } from "austenite/node";
import { beforeEach, describe, expect, it } from "vitest";
import { DeclarationFromOptions } from "../../../src/declaration.js";
import { Options } from "../../../src/declaration/number.js";
import { noop } from "../../helpers.js";

const validValueTable = [
  ["zero", "0.0", 0],
  ["positive zero", "+0.0", 0],
  ["negative zero", "-0.0", -0],
  ["positive", "123.456", 123.456],
  ["explicit positive", "+123.456", 123.456],
  ["negative", "-123.456", -123.456],
  ["exponential", "1.23456e+2", 123.456],
  ["octal", "0o361100", 123456],
  ["hexadecimal", "0x1e240", 123456],
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
  let declaration: DeclarationFromOptions<number, Options>;

  describe("when no options are supplied", () => {
    beforeEach(async () => {
      declaration = number("AUSTENITE_NUMBER", "<description>");

      await initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow(
        "AUSTENITE_NUMBER is not set and does not have a default value",
      );
    });
  });

  describe("when empty options are supplied", () => {
    beforeEach(async () => {
      declaration = number("AUSTENITE_NUMBER", "<description>", {});

      await initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow(
        "AUSTENITE_NUMBER is not set and does not have a default value",
      );
    });
  });

  describe("when the declaration is required", () => {
    beforeEach(() => {
      declaration = number("AUSTENITE_NUMBER", "<description>");
    });

    describe.each(validValueTable)(
      "when the value is valid (%s)",
      (_, number: string, expected: number) => {
        beforeEach(async () => {
          process.env.AUSTENITE_NUMBER = number;

          await initialize({ onInvalid: noop });
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
        beforeEach(async () => {
          process.env.AUSTENITE_NUMBER = number;

          await initialize({ onInvalid: noop });
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
      beforeEach(async () => {
        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "AUSTENITE_NUMBER is not set and does not have a default value",
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

    describe.each(validValueTable)(
      "when the value is valid (%s)",
      (_, number: string, expected: number) => {
        beforeEach(async () => {
          process.env.AUSTENITE_NUMBER = number;

          await initialize({ onInvalid: noop });
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
        beforeEach(async () => {
          process.env.AUSTENITE_NUMBER = number;

          await initialize({ onInvalid: noop });
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
        beforeEach(async () => {
          declaration = number("AUSTENITE_NUMBER", "<description>", {
            default: -123.456,
          });

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the default", () => {
            expect(declaration.value()).toBe(-123.456);
          });
        });
      });

      describe("when there is no default value", () => {
        beforeEach(async () => {
          declaration = number("AUSTENITE_NUMBER", "<description>", {
            default: undefined,
          });

          await initialize({ onInvalid: noop });
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
      declaration = number("AUSTENITE_NUMBER", "<description>", {
        constraints: [
          {
            description: "<constraint A>",
            constrain: (v) => v % 2 === 0 || "must be divisible by 2",
          },
          {
            description: "<constraint B>",
            constrain: (v) => v % 3 === 0 || "must be divisible by 3",
          },
        ],
        examples: [{ value: 6, label: "example" }],
      });
    });

    describe("when the value satisfies the constraints", () => {
      beforeEach(async () => {
        process.env.AUSTENITE_NUMBER = "6";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value()).toBe(6);
        });
      });
    });

    describe("when the value violates the first constraint", () => {
      beforeEach(async () => {
        process.env.AUSTENITE_NUMBER = "3";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_NUMBER (3) is invalid: must be divisible by 2",
          );
        });
      });
    });

    describe("when the value violates the second constraint", () => {
      beforeEach(async () => {
        process.env.AUSTENITE_NUMBER = "2";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_NUMBER (2) is invalid: must be divisible by 3",
          );
        });
      });
    });
  });

  describe("when the declaration has the constraints from the README", () => {
    beforeEach(() => {
      declaration = number("SAMPLE_RATIO", "ratio of requests to sample", {
        constraints: [
          {
            description: "must be a multiple of 0.01",
            constrain: (v) => v % 0.01 === 0 || "must be a multiple of 0.01",
          },
        ],
        examples: [{ value: 0.01, label: "1%" }],
      });
    });

    describe("when the value satisfies the constraints", () => {
      beforeEach(async () => {
        process.env.SAMPLE_RATIO = "0.01";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value()).toBe(0.01);
        });
      });
    });

    describe("when the value violates the constraints", () => {
      beforeEach(async () => {
        process.env.SAMPLE_RATIO = "0.001";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of SAMPLE_RATIO (0.001) is invalid: must be a multiple of 0.01",
          );
        });
      });
    });
  });
});
