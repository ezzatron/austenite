import { Declaration } from "../../../src/declaration.js";
import { Options } from "../../../src/declaration/network-port-number.js";
import { initialize, networkPortNumber } from "../../../src/index.js";
import { hasType, noop } from "../../helpers.js";

const validValueTable = [
  ["min", "1", 1],
  ["max", "65535", 65535],
] as const;

const invalidValueTable = [
  [
    "non-numeric",
    "host.example.org",
    "value of AUSTENITE_PORT (host.example.org) is invalid: must be an unsigned integer",
  ],
  [
    "non-integer",
    "123.456",
    "value of AUSTENITE_PORT (123.456) is invalid: must be an unsigned integer",
  ],
  [
    "negative sign",
    "-1",
    "value of AUSTENITE_PORT (-1) is invalid: must be an unsigned integer",
  ],
  [
    "positive sign",
    "+1",
    "value of AUSTENITE_PORT (+1) is invalid: must be an unsigned integer",
  ],
  [
    "leading zero",
    "01234",
    "value of AUSTENITE_PORT (01234) is invalid: must not have leading zeros",
  ],
  [
    "zero",
    "0",
    "value of AUSTENITE_PORT (0) is invalid: must be between 1 and 65535",
  ],
  [
    "above max",
    "65536",
    "value of AUSTENITE_PORT (65536) is invalid: must be between 1 and 65535",
  ],
];

describe("Network port number declarations", () => {
  let declaration: Declaration<number, Options<number>>;

  describe("when no options are supplied", () => {
    beforeEach(() => {
      declaration = networkPortNumber("AUSTENITE_PORT", "<description>");

      initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow(
        "AUSTENITE_PORT is undefined and does not have a default value",
      );
    });
  });

  describe("when empty options are supplied", () => {
    beforeEach(() => {
      declaration = networkPortNumber("AUSTENITE_PORT", "<description>", {});

      initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow(
        "AUSTENITE_PORT is undefined and does not have a default value",
      );
    });
  });

  describe("when the declaration is required", () => {
    beforeEach(() => {
      declaration = networkPortNumber("AUSTENITE_PORT", "<description>");
    });

    describe(".value()", () => {
      it("returns a number value", () => {
        // this test is weird because it tests type inference
        const declaration = networkPortNumber(
          "AUSTENITE_PORT",
          "<description>",
        );

        process.env.AUSTENITE_PORT = "12345";
        initialize({ onInvalid: noop });
        const actual = declaration.value();

        expect(hasType<number, typeof actual>(actual)).toBeNull();
      });
    });

    describe.each(validValueTable)(
      "when the value is valid (%s)",
      (_, integer: string, expected: number) => {
        beforeEach(() => {
          process.env.AUSTENITE_PORT = integer;

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
          process.env.AUSTENITE_PORT = integer;

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
            "AUSTENITE_PORT is undefined and does not have a default value",
          );
        });
      });
    });
  });

  describe("when the declaration is optional", () => {
    beforeEach(() => {
      declaration = networkPortNumber("AUSTENITE_PORT", "<description>", {
        default: undefined,
      });
    });

    describe(".value()", () => {
      it("returns an optional number value", () => {
        // this test is weird because it tests type inference
        const declaration = networkPortNumber(
          "AUSTENITE_PORT",
          "<description>",
          {
            default: undefined,
          },
        );

        initialize({ onInvalid: noop });
        const actual = declaration.value();

        expect(hasType<number | undefined, typeof actual>(actual)).toBeNull();
      });
    });

    describe.each(validValueTable)(
      "when the value is valid (%s)",
      (_, integer: string, expected: number) => {
        beforeEach(() => {
          process.env.AUSTENITE_PORT = integer;

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
          process.env.AUSTENITE_PORT = integer;

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
          declaration = networkPortNumber("AUSTENITE_PORT", "<description>", {
            default: 54321,
          });

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the default", () => {
            expect(declaration.value()).toBe(54321);
          });
        });
      });

      describe("when there is no default value", () => {
        beforeEach(() => {
          declaration = networkPortNumber("AUSTENITE_PORT", "<description>", {
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

  describe.each`
    description | port
    ${"min"}    | ${1}
    ${"max"}    | ${65535}
  `(
    "when using a valid default value ($description)",
    ({ port }: { port: number }) => {
      it("does not throw", () => {
        expect(() => {
          networkPortNumber("AUSTENITE_PORT", "<description>", {
            default: port,
          });
        }).not.toThrow();
      });
    },
  );

  describe.each`
    description      | port       | expected
    ${"non-integer"} | ${123.456} | ${"must be an unsigned integer"}
    ${"negative"}    | ${-1}      | ${"must be an unsigned integer"}
    ${"zero"}        | ${0}       | ${"must be between 1 and 65535"}
    ${"above max"}   | ${65536}   | ${"must be between 1 and 65535"}
  `(
    "when using an invalid default value ($description)",
    ({ port, expected }: { port: number; expected: string }) => {
      it("throws", () => {
        expect(() => {
          networkPortNumber("AUSTENITE_PORT", "<description>", {
            default: port,
          });
        }).toThrow(
          `specification for AUSTENITE_PORT is invalid: default value: ${expected}`,
        );
      });
    },
  );
});
