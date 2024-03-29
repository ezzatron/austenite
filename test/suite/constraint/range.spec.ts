import { Temporal } from "@js-temporal/polyfill";
import { beforeEach, describe, expect, it } from "vitest";
import {
  createDurationRangeConstraint,
  type RangeConstraintSpec,
} from "../../../src/constraint/range.js";
import { Declaration, type Options } from "../../../src/declaration.js";
import type {
  DeclarationExampleOptions,
  Example,
} from "../../../src/example.js";
import {
  bigInteger,
  duration,
  initialize,
  integer,
  networkPortNumber,
  number,
} from "../../../src/index.js";
import { noop } from "../../helpers.js";

const { Duration } = Temporal;
type Duration = Temporal.Duration;

type CreateDeclaration<T extends number | bigint | Duration> = (
  options: RangeOptions<T>,
) => RangeDeclaration<T>;

type RangeDeclaration<T extends number | bigint | Duration> = Declaration<
  T,
  RangeOptions<T>
>;

type RangeOptions<T extends number | bigint | Duration> = Options<T> &
  DeclarationExampleOptions<T> &
  RangeConstraintSpec<T>;

const createNumber = (options: RangeOptions<number>) =>
  number("AUSTENITE_VAR", "<description>", { examples: [], ...options });

const createInteger = (options: RangeOptions<number>) =>
  integer("AUSTENITE_VAR", "<description>", { examples: [], ...options });

const createBigInteger = (options: RangeOptions<bigint>) =>
  bigInteger("AUSTENITE_VAR", "<description>", { examples: [], ...options });

const createNetworkPortNumber = (options: RangeOptions<number>) =>
  networkPortNumber("AUSTENITE_VAR", "<description>", {
    examples: [],
    ...options,
  });

const createDuration = (options: RangeOptions<Duration>) =>
  duration("AUSTENITE_VAR", "<description>", { examples: [], ...options });

describe.each`
  label            | create                     | min                      | minCanonical | max                      | maxCanonical | ok        | okNative                 | low       | high
  ${"number"}      | ${createNumber}            | ${3.3}                   | ${"3.3"}     | ${3.5}                   | ${"3.5"}     | ${"3.4"}  | ${3.4}                   | ${"3.2"}  | ${"3.6"}
  ${"integer"}     | ${createInteger}           | ${3}                     | ${"3"}       | ${5}                     | ${"5"}       | ${"4"}    | ${4}                     | ${"2"}    | ${"6"}
  ${"bigInteger"}  | ${createBigInteger}        | ${3n}                    | ${"3"}       | ${5n}                    | ${"5"}       | ${"4"}    | ${4n}                    | ${"2"}    | ${"6"}
  ${"networkPort"} | ${createNetworkPortNumber} | ${3}                     | ${"3"}       | ${5}                     | ${"5"}       | ${"4"}    | ${4}                     | ${"2"}    | ${"6"}
  ${"duration"}    | ${createDuration}          | ${Duration.from("PT3S")} | ${"PT3S"}    | ${Duration.from("PT5S")} | ${"PT5S"}    | ${"PT4S"} | ${Duration.from("PT4S")} | ${"PT2S"} | ${"PT6S"}
`(
  "Range constraints ($label)",
  <T extends number | bigint | Duration>({
    create,
    min,
    minCanonical,
    max,
    maxCanonical,
    ok,
    okNative,
    low,
    high,
  }: {
    create: CreateDeclaration<T>;
    min: T;
    minCanonical: string;
    max: T;
    maxCanonical: string;
    ok: string;
    okNative: T;
    low: string;
    high: string;
  }) => {
    const examples: Example<T>[] = [{ value: okNative, label: "example" }];
    let declaration: RangeDeclaration<T>;

    describe("when the declaration has an inclusive minimum", () => {
      beforeEach(() => {
        declaration = create({
          min,
          minIsExclusive: false,
          examples,
        });
      });

      describe("when the value is less than the minimum", () => {
        beforeEach(async () => {
          process.env.AUSTENITE_VAR = low;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => {
              declaration.value();
            }).toThrow(
              `value of AUSTENITE_VAR (${low}) is invalid: must be >= ${minCanonical}`,
            );
          });
        });
      });

      describe("when the value is equal to the minimum", () => {
        beforeEach(async () => {
          process.env.AUSTENITE_VAR = minCanonical;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value", () => {
            expect(declaration.value()).toEqual(min);
          });
        });
      });

      describe("when the value is greater than the minimum", () => {
        beforeEach(async () => {
          process.env.AUSTENITE_VAR = ok;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value", () => {
            expect(declaration.value()).toEqual(okNative);
          });
        });
      });
    });

    describe("when the declaration has an exclusive minimum", () => {
      beforeEach(() => {
        declaration = create({
          min,
          minIsExclusive: true,
          examples,
        });
      });

      describe("when the value is less than the minimum", () => {
        beforeEach(async () => {
          process.env.AUSTENITE_VAR = low;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => {
              declaration.value();
            }).toThrow(
              `value of AUSTENITE_VAR (${low}) is invalid: must be > ${minCanonical}`,
            );
          });
        });
      });

      describe("when the value is equal to the minimum", () => {
        beforeEach(async () => {
          process.env.AUSTENITE_VAR = minCanonical;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => {
              declaration.value();
            }).toThrow(
              `value of AUSTENITE_VAR (${minCanonical}) is invalid: must be > ${minCanonical}`,
            );
          });
        });
      });

      describe("when the value is greater than the minimum", () => {
        beforeEach(async () => {
          process.env.AUSTENITE_VAR = ok;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value", () => {
            expect(declaration.value()).toEqual(okNative);
          });
        });
      });
    });

    describe("when the declaration has a minimum with no explicit exclusivity", () => {
      beforeEach(async () => {
        declaration = create({
          min,
          examples,
        });

        process.env.AUSTENITE_VAR = minCanonical;

        await initialize({ onInvalid: noop });
      });

      it("defaults to an inclusive minimum", () => {
        expect(declaration.value()).toEqual(min);
      });
    });

    describe("when the declaration has an inclusive maximum", () => {
      beforeEach(() => {
        declaration = create({
          max,
          maxIsExclusive: false,
          examples,
        });
      });

      describe("when the value is greater than the maximum", () => {
        beforeEach(async () => {
          process.env.AUSTENITE_VAR = high;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => {
              declaration.value();
            }).toThrow(
              `value of AUSTENITE_VAR (${high}) is invalid: must be <= ${maxCanonical}`,
            );
          });
        });
      });

      describe("when the value is equal to the maximum", () => {
        beforeEach(async () => {
          process.env.AUSTENITE_VAR = maxCanonical;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value", () => {
            expect(declaration.value()).toEqual(max);
          });
        });
      });

      describe("when the value is less than the maximum", () => {
        beforeEach(async () => {
          process.env.AUSTENITE_VAR = ok;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value", () => {
            expect(declaration.value()).toEqual(okNative);
          });
        });
      });
    });

    describe("when the declaration has an exclusive maximum", () => {
      beforeEach(() => {
        declaration = create({
          max,
          maxIsExclusive: true,
          examples,
        });
      });

      describe("when the value is greater than the maximum", () => {
        beforeEach(async () => {
          process.env.AUSTENITE_VAR = high;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => {
              declaration.value();
            }).toThrow(
              `value of AUSTENITE_VAR (${high}) is invalid: must be < ${maxCanonical}`,
            );
          });
        });
      });

      describe("when the value is equal to the maximum", () => {
        beforeEach(async () => {
          process.env.AUSTENITE_VAR = maxCanonical;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => {
              declaration.value();
            }).toThrow(
              `value of AUSTENITE_VAR (${maxCanonical}) is invalid: must be < ${maxCanonical}`,
            );
          });
        });
      });

      describe("when the value is less than the maximum", () => {
        beforeEach(async () => {
          process.env.AUSTENITE_VAR = ok;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value", () => {
            expect(declaration.value()).toEqual(okNative);
          });
        });
      });
    });

    describe("when the declaration has a maximum with no explicit exclusivity", () => {
      beforeEach(async () => {
        declaration = create({
          max,
          examples,
        });

        process.env.AUSTENITE_VAR = maxCanonical;

        await initialize({ onInvalid: noop });
      });

      it("defaults to an inclusive maximum", () => {
        expect(declaration.value()).toEqual(max);
      });
    });

    describe("when the declaration has a range", () => {
      beforeEach(() => {
        declaration = create({
          min,
          max,
          examples,
        });
      });

      describe("when the value is less than the minimum", () => {
        beforeEach(async () => {
          process.env.AUSTENITE_VAR = low;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => {
              declaration.value();
            }).toThrow(
              `value of AUSTENITE_VAR (${low}) is invalid: must be >= ${minCanonical}`,
            );
          });
        });
      });

      describe("when the value is equal to the minimum", () => {
        beforeEach(async () => {
          process.env.AUSTENITE_VAR = minCanonical;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value", () => {
            expect(declaration.value()).toEqual(min);
          });
        });
      });

      describe("when the value is between the minimum and maximum", () => {
        beforeEach(async () => {
          process.env.AUSTENITE_VAR = ok;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value", () => {
            expect(declaration.value()).toEqual(okNative);
          });
        });
      });

      describe("when the value is equal to the maximum", () => {
        beforeEach(async () => {
          process.env.AUSTENITE_VAR = maxCanonical;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value", () => {
            expect(declaration.value()).toEqual(max);
          });
        });
      });

      describe("when the value is greater than the maximum", () => {
        beforeEach(async () => {
          process.env.AUSTENITE_VAR = high;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => {
              declaration.value();
            }).toThrow(
              `value of AUSTENITE_VAR (${high}) is invalid: must be <= ${maxCanonical}`,
            );
          });
        });
      });
    });

    describe("when the declaration has a minimum that is equal to the maximum", () => {
      it("throws", () => {
        expect(() => {
          create({
            min: max,
            max,
            examples,
          });
        }).toThrow(
          `specification for AUSTENITE_VAR is invalid: minimum (${maxCanonical}) is >= maximum (${maxCanonical})`,
        );
      });
    });

    describe("when the declaration has a minimum that is greater than the maximum", () => {
      it("throws", () => {
        expect(() => {
          create({
            min: max,
            max: min,
            examples,
          });
        }).toThrow(
          `specification for AUSTENITE_VAR is invalid: minimum (${maxCanonical}) is >= maximum (${minCanonical})`,
        );
      });
    });

    describe("when the declaration has a default that violates the range constraint", () => {
      it("throws", () => {
        expect(() => {
          create({
            default: okNative,
            min: max,
            examples: [{ value: max, label: "example" }],
          });
        }).toThrow(
          `specification for AUSTENITE_VAR is invalid: default value: must be >= ${maxCanonical}`,
        );
      });
    });
  },
);

describe("when a duration range constraint has no minimum or maximum", () => {
  it("throws", () => {
    expect(() => {
      createDurationRangeConstraint({});
    }).toThrow(
      "invariant violation: at least one of min or max must be defined",
    );
  });
});
