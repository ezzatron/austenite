import { beforeEach, describe, expect, it } from "vitest";
import { Declaration } from "../../../src/declaration.js";
import { Options } from "../../../src/declaration/big-integer.js";
import { bigInteger } from "../../../src/index.js";
import { initialize } from "../../../src/node.js";
import { noop } from "../../helpers.js";

const validValueTable = [
  ["zero", "0", 0n],
  ["positive zero", "+0", 0n],
  ["negative zero", "-0", -0n],
  ["positive", "123456", 123456n],
  ["explicit positive", "+123456", 123456n],
  ["negative", "-123456", -123456n],
  ["octal", "0o361100", 123456n],
  ["hexadecimal", "0x1e240", 123456n],
  ["binary", "0b11110001001000000", 123456n],
] as const;

const invalidValueTable = [
  [
    "non-numeric",
    "a",
    "value of AUSTENITE_INTEGER (a) is invalid: must be a big integer",
  ],
  [
    "too many decimal places",
    "1.2.3",
    "value of AUSTENITE_INTEGER (1.2.3) is invalid: must be a big integer",
  ],
  [
    "non-integer",
    "1.2",
    "value of AUSTENITE_INTEGER (1.2) is invalid: must be a big integer",
  ],
  [
    "contains whitespace",
    "1 .2",
    "value of AUSTENITE_INTEGER ('1 .2') is invalid: must be a big integer",
  ],
  [
    "exponential",
    "1.23456e+5",
    "value of AUSTENITE_INTEGER (1.23456e+5) is invalid: must be a big integer",
  ],
];

describe("Big integer declarations", () => {
  let declaration: Declaration<bigint, Options>;

  describe("when no options are supplied", () => {
    beforeEach(async () => {
      declaration = bigInteger("AUSTENITE_INTEGER", "<description>");

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
      declaration = bigInteger("AUSTENITE_INTEGER", "<description>", {});

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
      declaration = bigInteger("AUSTENITE_INTEGER", "<description>");
    });

    describe.each(validValueTable)(
      "when the value is valid (%s)",
      (_, integer: string, expected: bigint) => {
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
      declaration = bigInteger("AUSTENITE_INTEGER", "<description>", {
        default: undefined,
      });
    });

    describe.each(validValueTable)(
      "when the value is valid (%s)",
      (_, integer: string, expected: bigint) => {
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
          declaration = bigInteger("AUSTENITE_INTEGER", "<description>", {
            default: -123456n,
          });

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the default", () => {
            expect(declaration.value()).toBe(-123456n);
          });
        });
      });

      describe("when there is no default value", () => {
        beforeEach(async () => {
          declaration = bigInteger("AUSTENITE_INTEGER", "<description>", {
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
      declaration = bigInteger("AUSTENITE_INTEGER", "<description>", {
        constraints: [
          {
            description: "<constraint A>",
            constrain: (v) => v % 2n === 0n || "must be divisible by 2",
          },
          {
            description: "<constraint B>",
            constrain: (v) => v % 3n === 0n || "must be divisible by 3",
          },
        ],
        examples: [{ value: 6n, label: "example" }],
      });
    });

    describe("when the value satisfies the constraints", () => {
      beforeEach(async () => {
        process.env.AUSTENITE_INTEGER = "6";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value()).toBe(6n);
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
      declaration = bigInteger("EARTH_ATOM_COUNT", "number of atoms on earth", {
        constraints: [
          {
            description: "must be a multiple of 1000",
            constrain: (v) => v % 1_000n === 0n || "must be a multiple of 1000",
          },
        ],
        examples: [
          {
            value: 5_972_200_000_000_000_000_000_000n,
            label: "5.9722 septillion",
          },
        ],
      });
    });

    describe("when the value satisfies the constraints", () => {
      beforeEach(async () => {
        process.env.EARTH_ATOM_COUNT = "5972200000000000000000000";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value()).toBe(5_972_200_000_000_000_000_000_000n);
        });
      });
    });

    describe("when the value violates the constraints", () => {
      beforeEach(async () => {
        process.env.EARTH_ATOM_COUNT = "5972200000000000000000001";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of EARTH_ATOM_COUNT (5972200000000000000000001) is invalid: must be a multiple of 1000",
          );
        });
      });
    });
  });
});
