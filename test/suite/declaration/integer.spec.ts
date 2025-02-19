import { integer } from "austenite";
import { initialize } from "austenite/node";
import { beforeEach, describe, expect, it } from "vitest";
import { DeclarationFromOptions } from "../../../src/declaration.js";
import { Options } from "../../../src/declaration/integer.js";
import { noop } from "../../helpers.js";

const validValueTable = [
  ["zero", "0", 0],
  ["positive zero", "+0", 0],
  ["negative zero", "-0", -0],
  ["positive", "123456", 123456],
  ["explicit positive", "+123456", 123456],
  ["negative", "-123456", -123456],
  ["exponential", "1.23456e+5", 123456],
  ["octal", "0o361100", 123456],
  ["hexadecimal", "0x1e240", 123456],
  ["binary", "0b11110001001000000", 123456],
] as const;

const invalidValueTable = [
  [
    "non-numeric",
    "a",
    "value of AUSTENITE_INTEGER (a) is invalid: must be an integer",
  ],
  [
    "too many decimal places",
    "1.2.3",
    "value of AUSTENITE_INTEGER (1.2.3) is invalid: must be an integer",
  ],
  [
    "non-integer",
    "1.2",
    "value of AUSTENITE_INTEGER (1.2) is invalid: must be an integer",
  ],
  [
    "contains whitespace",
    "1 .2",
    "value of AUSTENITE_INTEGER ('1 .2') is invalid: must be an integer",
  ],
];

describe("Integer declarations", () => {
  let declaration: DeclarationFromOptions<number, Options>;

  describe("when no options are supplied", () => {
    beforeEach(async () => {
      declaration = integer("AUSTENITE_INTEGER", "<description>");

      await initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow(
        "AUSTENITE_INTEGER is not set and does not have a default value",
      );
    });
  });

  describe("when empty options are supplied", () => {
    beforeEach(async () => {
      declaration = integer("AUSTENITE_INTEGER", "<description>", {});

      await initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow(
        "AUSTENITE_INTEGER is not set and does not have a default value",
      );
    });
  });

  describe("when the declaration is required", () => {
    beforeEach(() => {
      declaration = integer("AUSTENITE_INTEGER", "<description>");
    });

    describe.each(validValueTable)(
      "when the value is valid (%s)",
      (_, integer: string, expected: number) => {
        beforeEach(async () => {
          process.env.AUSTENITE_INTEGER = integer;

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
      (_, integer: string, expected: string) => {
        beforeEach(async () => {
          process.env.AUSTENITE_INTEGER = integer;

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
            "AUSTENITE_INTEGER is not set and does not have a default value",
          );
        });
      });
    });
  });

  describe("when the declaration is optional", () => {
    beforeEach(() => {
      declaration = integer("AUSTENITE_INTEGER", "<description>", {
        default: undefined,
      });
    });

    describe.each(validValueTable)(
      "when the value is valid (%s)",
      (_, integer: string, expected: number) => {
        beforeEach(async () => {
          process.env.AUSTENITE_INTEGER = integer;

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
      (_, integer: string, expected: string) => {
        beforeEach(async () => {
          process.env.AUSTENITE_INTEGER = integer;

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
          declaration = integer("AUSTENITE_INTEGER", "<description>", {
            default: -123456,
          });

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the default", () => {
            expect(declaration.value()).toBe(-123456);
          });
        });
      });

      describe("when there is no default value", () => {
        beforeEach(async () => {
          declaration = integer("AUSTENITE_INTEGER", "<description>", {
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

  describe("when the declaration has a minimum that is not an integer", () => {
    it("throws", () => {
      expect(() => {
        integer("AUSTENITE_INTEGER", "<description>", {
          min: 3.5,
        });
      }).toThrow(
        "specification for AUSTENITE_INTEGER is invalid: minimum (3.5) must be an integer",
      );
    });
  });

  describe("when the declaration has a maximum that is not an integer", () => {
    it("throws", () => {
      expect(() => {
        integer("AUSTENITE_INTEGER", "<description>", {
          max: 3.5,
        });
      }).toThrow(
        "specification for AUSTENITE_INTEGER is invalid: maximum (3.5) must be an integer",
      );
    });
  });

  describe("when the declaration has constraints", () => {
    beforeEach(() => {
      declaration = integer("AUSTENITE_INTEGER", "<description>", {
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
        process.env.AUSTENITE_INTEGER = "6";

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
        process.env.AUSTENITE_INTEGER = "3";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_INTEGER (3) is invalid: must be divisible by 2",
          );
        });
      });
    });

    describe("when the value violates the second constraint", () => {
      beforeEach(async () => {
        process.env.AUSTENITE_INTEGER = "2";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_INTEGER (2) is invalid: must be divisible by 3",
          );
        });
      });
    });
  });

  describe("when the declaration has the constraints from the README", () => {
    beforeEach(() => {
      declaration = integer("WEIGHT", "weighting for this node", {
        constraints: [
          {
            description: "must be a multiple of 10",
            constrain: (v) => v % 10 === 0 || "must be a multiple of 10",
          },
        ],
        examples: [{ value: 100, label: "100" }],
      });
    });

    describe("when the value satisfies the constraints", () => {
      beforeEach(async () => {
        process.env.WEIGHT = "300";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value()).toBe(300);
        });
      });
    });

    describe("when the value violates the constraints", () => {
      beforeEach(async () => {
        process.env.WEIGHT = "301";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of WEIGHT (301) is invalid: must be a multiple of 10",
          );
        });
      });
    });
  });
});
