import { beforeEach, describe, expect, it } from "vitest";
import type { LengthConstraintSpec } from "../../../src/constraint/length.js";
import type { Declaration, Options } from "../../../src/declaration.js";
import type {
  DeclarationExampleOptions,
  Example,
} from "../../../src/example.js";
import { binary, initialize, string } from "../../../src/index.js";
import { toString } from "../../../src/schema.js";
import { noop } from "../../helpers.js";

type CreateDeclaration<T extends { length: number }> = (
  options: LengthOptions<T>,
) => LengthDeclaration<T>;

type LengthDeclaration<T extends { length: number }> = Declaration<
  T,
  LengthOptions<T>
>;

type LengthOptions<T extends { length: number }> = Options<T> &
  DeclarationExampleOptions<T> & {
    length: LengthConstraintSpec;
  };

const createString = (options: LengthOptions<string>) =>
  string("AUSTENITE_VAR", "<description>", { examples: [], ...options });

const createBinary = (options: LengthOptions<Buffer>) =>
  binary("AUSTENITE_VAR", "<description>", { examples: [], ...options });

const toUTF8 = (buffer: Buffer) => buffer.toString("utf8");

describe.each`
  label       | stringify   | create          | lengthType          | min  | max  | shortest  | shortestNative                | longest   | longestNative                  | tooShort  | tooLong
  ${"string"} | ${toString} | ${createString} | ${"length"}         | ${2} | ${3} | ${"ab"}   | ${"ab"}                       | ${"abc"}  | ${"abc"}                       | ${"a"}    | ${"abcd"}
  ${"binary"} | ${toUTF8}   | ${createBinary} | ${"decoded length"} | ${2} | ${3} | ${"YWI="} | ${Buffer.from("ab", "utf-8")} | ${"YWJj"} | ${Buffer.from("abc", "utf-8")} | ${"YQ=="} | ${"YWJjZA=="}
`(
  "Length constraints ($label)",
  <T extends { length: number }>({
    create,
    stringify,
    lengthType,
    min,
    max,
    shortest,
    shortestNative,
    longest,
    longestNative,
    tooShort,
    tooLong,
  }: {
    create: CreateDeclaration<T>;
    stringify: (value: unknown) => string;
    lengthType: string;
    min: number;
    max: number;
    shortest: string;
    shortestNative: T;
    longest: string;
    longestNative: T;
    tooShort: string;
    tooLong: string;
  }) => {
    const examples: Example<T>[] = [
      { value: shortestNative, label: "example" },
    ];
    let declaration: LengthDeclaration<T>;

    describe("when the declaration has an exact length", () => {
      beforeEach(() => {
        declaration = create({
          length: min,
          examples,
        });
      });

      describe("when the value is too short", () => {
        beforeEach(() => {
          process.env.AUSTENITE_VAR = tooShort;

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => {
              declaration.value();
            }).toThrow(
              `value of AUSTENITE_VAR (${tooShort}) is invalid: ` +
                `must have a ${lengthType} of ${min}, ` +
                `but has a ${lengthType} of ${min - 1}`,
            );
          });
        });
      });

      describe("when the value is too long", () => {
        beforeEach(() => {
          process.env.AUSTENITE_VAR = tooLong;

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => {
              declaration.value();
            }).toThrow(
              `value of AUSTENITE_VAR (${tooLong}) is invalid: ` +
                `must have a ${lengthType} of ${min}, ` +
                `but has a ${lengthType} of ${max + 1}`,
            );
          });
        });
      });

      describe("when the value is the right length", () => {
        beforeEach(() => {
          process.env.AUSTENITE_VAR = shortest;

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value", () => {
            expect(stringify(declaration.value())).toEqual(
              stringify(shortestNative),
            );
          });
        });
      });
    });

    describe("when the declaration has a minimum length", () => {
      beforeEach(() => {
        declaration = create({
          length: {
            min,
          },
          examples,
        });
      });

      describe("when the value is too short", () => {
        beforeEach(() => {
          process.env.AUSTENITE_VAR = tooShort;

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => {
              declaration.value();
            }).toThrow(
              `value of AUSTENITE_VAR (${tooShort}) is invalid: ` +
                `must have a minimum ${lengthType} of ${min}, ` +
                `but has a ${lengthType} of ${min - 1}`,
            );
          });
        });
      });

      describe("when the value is the long enough", () => {
        beforeEach(() => {
          process.env.AUSTENITE_VAR = shortest;

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value", () => {
            expect(stringify(declaration.value())).toEqual(
              stringify(shortestNative),
            );
          });
        });
      });
    });

    describe("when the declaration has a maximum length", () => {
      beforeEach(() => {
        declaration = create({
          length: {
            max,
          },
          examples,
        });
      });

      describe("when the value is too long", () => {
        beforeEach(() => {
          process.env.AUSTENITE_VAR = tooLong;

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => {
              declaration.value();
            }).toThrow(
              `value of AUSTENITE_VAR (${tooLong}) is invalid: ` +
                `must have a maximum ${lengthType} of ${max}, ` +
                `but has a ${lengthType} of ${max + 1}`,
            );
          });
        });
      });

      describe("when the value is short enough", () => {
        beforeEach(() => {
          process.env.AUSTENITE_VAR = longest;

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value", () => {
            expect(stringify(declaration.value())).toEqual(
              stringify(longestNative),
            );
          });
        });
      });
    });

    describe("when the declaration has a minimum and maximum length", () => {
      beforeEach(() => {
        declaration = create({
          length: {
            min,
            max,
          },
          examples,
        });
      });

      describe("when the value is too short", () => {
        beforeEach(() => {
          process.env.AUSTENITE_VAR = tooShort;

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => {
              declaration.value();
            }).toThrow(
              `value of AUSTENITE_VAR (${tooShort}) is invalid: ` +
                `must have a ${lengthType} between ${min} and ${max}, ` +
                `but has a ${lengthType} of ${min - 1}`,
            );
          });
        });
      });

      describe("when the value is too long", () => {
        beforeEach(() => {
          process.env.AUSTENITE_VAR = tooLong;

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => {
              declaration.value();
            }).toThrow(
              `value of AUSTENITE_VAR (${tooLong}) is invalid: ` +
                `must have a ${lengthType} between ${min} and ${max}, ` +
                `but has a ${lengthType} of ${max + 1}`,
            );
          });
        });
      });

      describe("when the value is the shortest allowed", () => {
        beforeEach(() => {
          process.env.AUSTENITE_VAR = shortest;

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value", () => {
            expect(stringify(declaration.value())).toEqual(
              stringify(shortestNative),
            );
          });
        });
      });

      describe("when the value is the longest allowed", () => {
        beforeEach(() => {
          process.env.AUSTENITE_VAR = longest;

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value", () => {
            expect(stringify(declaration.value())).toEqual(
              stringify(longestNative),
            );
          });
        });
      });
    });

    describe("when the declaration has a minimum length that is equal to the maximum length", () => {
      it("throws", () => {
        expect(() => {
          create({
            length: {
              min: max,
              max,
            },
            examples,
          });
        }).toThrow(
          `specification for AUSTENITE_VAR is invalid: ` +
            `minimum length (${max}) is >= maximum length (${max})`,
        );
      });
    });

    describe("when the declaration has a minimum length that is greater than the maximum length", () => {
      it("throws", () => {
        expect(() => {
          create({
            length: {
              min: max,
              max: min,
            },
            examples,
          });
        }).toThrow(
          `specification for AUSTENITE_VAR is invalid: ` +
            `minimum length (${max}) is >= maximum length (${min})`,
        );
      });
    });

    describe("when the declaration has a default that violates the length constraint", () => {
      it("throws", () => {
        expect(() => {
          create({
            default: shortestNative,
            length: {
              min: max,
            },
            examples: [{ value: longestNative, label: "example" }],
          });
        }).toThrow(
          `specification for AUSTENITE_VAR is invalid: default value: ` +
            `must have a minimum ${lengthType} of ${max}, ` +
            `but has a ${lengthType} of ${min}`,
        );
      });
    });
  },
);
