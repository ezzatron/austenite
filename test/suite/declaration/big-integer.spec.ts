import { beforeEach, describe, expect, it } from "vitest";
import { Declaration } from "../../../src/declaration.js";
import { Options } from "../../../src/declaration/big-integer.js";
import { bigInteger, initialize } from "../../../src/index.js";
import { noop } from "../../helpers.js";

const validValueTable = [
  ["zero", "0", 0n],
  ["positive zero", "+0", 0n],
  ["negative zero", "-0", -0n],
  ["positive", "123456", 123456n],
  ["explicit positive", "+123456", 123456n],
  ["negative", "-123456", -123456n],
  ["octal", "0o361100", 123456n],
  ["hexadecimal", "0x1E240", 123456n],
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
    beforeEach(() => {
      declaration = bigInteger("AUSTENITE_INTEGER", "<description>");

      initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow(
        "AUSTENITE_INTEGER is undefined and does not have a default value",
      );
    });
  });

  describe("when empty options are supplied", () => {
    beforeEach(() => {
      declaration = bigInteger("AUSTENITE_INTEGER", "<description>", {});

      initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow(
        "AUSTENITE_INTEGER is undefined and does not have a default value",
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
        beforeEach(() => {
          process.env.AUSTENITE_INTEGER = integer;

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
      (_, integer: string, expected: string) => {
        beforeEach(() => {
          process.env.AUSTENITE_INTEGER = integer;

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
            "AUSTENITE_INTEGER is undefined and does not have a default value",
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
        beforeEach(() => {
          process.env.AUSTENITE_INTEGER = integer;

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
      (_, integer: string, expected: string) => {
        beforeEach(() => {
          process.env.AUSTENITE_INTEGER = integer;

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
          declaration = bigInteger("AUSTENITE_INTEGER", "<description>", {
            default: -123456n,
          });

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the default", () => {
            expect(declaration.value()).toBe(-123456n);
          });
        });
      });

      describe("when there is no default value", () => {
        beforeEach(() => {
          declaration = bigInteger("AUSTENITE_INTEGER", "<description>", {
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
