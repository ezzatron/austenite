import { beforeEach, describe, expect, it } from "vitest";
import { Declaration } from "../../../src/declaration.js";
import { Options } from "../../../src/declaration/network-port-number.js";
import { networkPortNumber } from "../../../src/index.js";
import { initialize } from "../../../src/node.js";
import { noop } from "../../helpers.js";

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
  let declaration: Declaration<number, Options>;

  describe("when no options are supplied", () => {
    beforeEach(async () => {
      declaration = networkPortNumber("AUSTENITE_PORT", "<description>");

      await initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow("AUSTENITE_PORT is not set and does not have a default value");
    });
  });

  describe("when empty options are supplied", () => {
    beforeEach(async () => {
      declaration = networkPortNumber("AUSTENITE_PORT", "<description>", {});

      await initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow("AUSTENITE_PORT is not set and does not have a default value");
    });
  });

  describe("when the declaration is required", () => {
    beforeEach(() => {
      declaration = networkPortNumber("AUSTENITE_PORT", "<description>");
    });

    describe.each(validValueTable)(
      "when the value is valid (%s)",
      (_, integer: string, expected: number) => {
        beforeEach(async () => {
          process.env.AUSTENITE_PORT = integer;

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
          process.env.AUSTENITE_PORT = integer;

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
            "AUSTENITE_PORT is not set and does not have a default value",
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

    describe.each(validValueTable)(
      "when the value is valid (%s)",
      (_, integer: string, expected: number) => {
        beforeEach(async () => {
          process.env.AUSTENITE_PORT = integer;

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
          process.env.AUSTENITE_PORT = integer;

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
          declaration = networkPortNumber("AUSTENITE_PORT", "<description>", {
            default: 54321,
          });

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the default", () => {
            expect(declaration.value()).toBe(54321);
          });
        });
      });

      describe("when there is no default value", () => {
        beforeEach(async () => {
          declaration = networkPortNumber("AUSTENITE_PORT", "<description>", {
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

  describe.each`
    description      | port       | expected
    ${"non-integer"} | ${123.456} | ${"must be an unsigned integer"}
    ${"negative"}    | ${-1}      | ${"must be an unsigned integer"}
    ${"zero"}        | ${0}       | ${"must be between 1 and 65535"}
    ${"above max"}   | ${65536}   | ${"must be between 1 and 65535"}
  `(
    "when using an invalid minimum ($description)",
    ({ port, expected }: { port: number; expected: string }) => {
      it("throws", () => {
        expect(() => {
          networkPortNumber("AUSTENITE_PORT", "<description>", {
            min: port,
          });
        }).toThrow(
          `specification for AUSTENITE_PORT is invalid: minimum (${port}) ${expected}`,
        );
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
    "when using an invalid maximum ($description)",
    ({ port, expected }: { port: number; expected: string }) => {
      it("throws", () => {
        expect(() => {
          networkPortNumber("AUSTENITE_PORT", "<description>", {
            max: port,
          });
        }).toThrow(
          `specification for AUSTENITE_PORT is invalid: maximum (${port}) ${expected}`,
        );
      });
    },
  );

  describe("when the declaration has constraints", () => {
    beforeEach(() => {
      declaration = networkPortNumber("AUSTENITE_PORT", "<description>", {
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
        process.env.AUSTENITE_PORT = "6";

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
        process.env.AUSTENITE_PORT = "3";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_PORT (3) is invalid: must be divisible by 2",
          );
        });
      });
    });

    describe("when the value violates the second constraint", () => {
      beforeEach(async () => {
        process.env.AUSTENITE_PORT = "2";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_PORT (2) is invalid: must be divisible by 3",
          );
        });
      });
    });
  });

  describe("when the declaration has the constraints from the README", () => {
    beforeEach(() => {
      declaration = networkPortNumber(
        "PORT",
        "listen port for the HTTP server",
        {
          constraints: [
            {
              description: "must not be disallowed",
              constrain: (v) => ![1337, 31337].includes(v) || "not allowed",
            },
          ],
          examples: [{ value: 8080, label: "standard" }],
        },
      );
    });

    describe("when the value satisfies the constraints", () => {
      beforeEach(async () => {
        process.env.PORT = "8080";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value()).toBe(8080);
        });
      });
    });

    describe("when the value violates the constraints", () => {
      beforeEach(async () => {
        process.env.PORT = "1337";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow("value of PORT (1337) is invalid: not allowed");
        });
      });
    });
  });
});
