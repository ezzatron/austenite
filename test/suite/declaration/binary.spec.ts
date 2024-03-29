import { Buffer } from "buffer";
import { beforeEach, describe, expect, it } from "vitest";
import { Declaration } from "../../../src/declaration.js";
import { Options } from "../../../src/declaration/binary.js";
import { binary, initialize } from "../../../src/index.js";
import { noop } from "../../helpers.js";

const validValueTable = [
  ["ascii", "ascii", "light work", "light work"],
  ["base64 no padding", "base64", "bGlnaHQgd29y", "light wor"],
  ["base64 single padding", "base64", "bGlnaHQgd28=", "light wo"],
  ["base64 double padding", "base64", "bGlnaHQgdw==", "light w"],
  ["base64 missing single padding", "base64", "bGlnaHQgd28", "light wo"],
  ["base64 missing double padding", "base64", "bGlnaHQgdw", "light w"],
  ["base64url", "base64url", "Pz8_Pz8_Pz8_", "?????????"],
  ["binary", "binary", "light work", "light work"],
  ["hex", "hex", "6c6967687420776f726b", "light work"],
  ["latin1", "latin1", "light work", "light work"],
  ["ucs-2", "ucs-2", toEncoding("ucs-2", "light work"), "light work"],
  ["ucs2", "ucs2", toEncoding("ucs2", "light work"), "light work"],
  ["utf-16le", "utf-16le", toEncoding("utf-16le", "light work"), "light work"],
  ["utf-8", "utf-8", toEncoding("utf-8", "light work"), "light work"],
  ["utf16le", "utf16le", toEncoding("utf16le", "light work"), "light work"],
  ["utf8", "utf8", toEncoding("utf8", "light work"), "light work"],
] as const;

const invalidValueTable = [
  [
    "base64 non-base64",
    "base64",
    "@",
    "value of AUSTENITE_BINARY (@) is invalid: must be base64 encoded",
  ],
  [
    "base64 contains whitespace",
    "base64",
    "MTIz NDU2",
    "value of AUSTENITE_BINARY ('MTIz NDU2') is invalid: must be base64 encoded",
  ],
] as const;

describe("Binary declarations", () => {
  let declaration: Declaration<Buffer, Options>;

  describe("when no options are supplied", () => {
    beforeEach(() => {
      declaration = binary("AUSTENITE_BINARY", "<description>");
    });

    it("defaults to a required declaration", async () => {
      await initialize({ onInvalid: noop });

      expect(() => {
        declaration.value();
      }).toThrow(
        "AUSTENITE_BINARY is not set and does not have a default value",
      );
    });

    it("defaults to base64 encoding", async () => {
      process.env.AUSTENITE_BINARY = "bGlnaHQgd29y";
      await initialize({ onInvalid: noop });

      expect(declaration.value().toString("utf-8")).toEqual("light wor");
    });
  });

  describe("when empty options are supplied", () => {
    beforeEach(async () => {
      declaration = binary("AUSTENITE_BINARY", "<description>", {});

      await initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow(
        "AUSTENITE_BINARY is not set and does not have a default value",
      );
    });
  });

  describe("when the declaration is required", () => {
    describe.each(validValueTable)(
      "when the value is valid (%s)",
      (_, encoding, encoded, expected) => {
        beforeEach(async () => {
          declaration = binary("AUSTENITE_BINARY", "<description>", {
            encoding,
          });
          process.env.AUSTENITE_BINARY = encoded;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value", () => {
            expect(declaration.value().toString("utf-8")).toEqual(expected);
          });

          it("returns the same value when called multiple times", () => {
            expect(declaration.value().toString("utf-8")).toEqual(expected);
            expect(declaration.value().toString("utf-8")).toEqual(expected);
          });
        });
      },
    );

    describe.each(invalidValueTable)(
      "when the value is invalid (%s)",
      (_, encoding, encoded, expected) => {
        beforeEach(async () => {
          declaration = binary("AUSTENITE_BINARY", "<description>", {
            encoding,
          });
          process.env.AUSTENITE_BINARY = encoded;

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
        declaration = binary("AUSTENITE_BINARY", "<description>");
        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "AUSTENITE_BINARY is not set and does not have a default value",
          );
        });
      });
    });
  });

  describe("when the declaration is optional", () => {
    describe.each(validValueTable)(
      "when the value is valid (%s)",
      (_, encoding, encoded, expected) => {
        beforeEach(async () => {
          declaration = binary("AUSTENITE_BINARY", "<description>", {
            encoding,
            default: undefined,
          });
          process.env.AUSTENITE_BINARY = encoded;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value", () => {
            expect(declaration.value().toString("utf-8")).toEqual(expected);
          });
        });
      },
    );

    describe.each(invalidValueTable)(
      "when the value is invalid (%s)",
      (_, encoding, encoded, expected) => {
        beforeEach(async () => {
          declaration = binary("AUSTENITE_BINARY", "<description>", {
            encoding,
            default: undefined,
          });
          process.env.AUSTENITE_BINARY = encoded;

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
          declaration = binary("AUSTENITE_BINARY", "<description>", {
            default: Buffer.from("<default>", "utf-8"),
          });

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the default", () => {
            expect(declaration.value().toString("utf-8")).toEqual("<default>");
          });
        });
      });

      describe("when there is no default value", () => {
        beforeEach(async () => {
          declaration = binary("AUSTENITE_BINARY", "<description>", {
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
      declaration = binary("AUSTENITE_BINARY", "<description>", {
        constraints: [
          {
            description: "<constraint A>",
            constrain: (v) =>
              v.length % 2 === 0 || "length must be divisible by 2",
          },
          {
            description: "<constraint B>",
            constrain: (v) =>
              v.length % 3 === 0 || "length must be divisible by 3",
          },
        ],
        examples: [{ value: Buffer.from("abcdef", "utf-8"), label: "example" }],
      });
    });

    describe("when the value satisfies the constraints", () => {
      beforeEach(async () => {
        process.env.AUSTENITE_BINARY = "YWJjZGVm";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value().toString("utf-8")).toEqual("abcdef");
        });
      });
    });

    describe("when the value violates the first constraint", () => {
      beforeEach(async () => {
        process.env.AUSTENITE_BINARY = "YWJj";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_BINARY (YWJj) is invalid: length must be divisible by 2",
          );
        });
      });
    });

    describe("when the value violates the second constraint", () => {
      beforeEach(async () => {
        process.env.AUSTENITE_BINARY = "YWI=";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_BINARY (YWI=) is invalid: length must be divisible by 3",
          );
        });
      });
    });
  });

  describe("when the declaration has the constraints from the README", () => {
    beforeEach(() => {
      declaration = binary("SESSION_KEY", "session token signing key", {
        constraints: [
          {
            description: "must be 128 or 256 bits",
            constrain: (v) =>
              [16, 32].includes(v.length) || "decoded length must be 16 or 32",
          },
        ],
        examples: [
          {
            value: Buffer.from("SUPER_SECRET_256_BIT_SIGNING_KEY", "utf-8"),
            label: "256-bit key",
          },
        ],
      });
    });

    describe("when the value satisfies the constraints", () => {
      beforeEach(async () => {
        process.env.SESSION_KEY = Buffer.from(
          "SUPER_SECRET_256_BIT_SIGNING_KEY",
          "utf-8",
        ).toString("base64");

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value().toString("utf-8")).toEqual(
            "SUPER_SECRET_256_BIT_SIGNING_KEY",
          );
        });
      });
    });

    describe("when the value violates the constraints", () => {
      beforeEach(async () => {
        process.env.SESSION_KEY = Buffer.from("INVALID", "utf-8").toString(
          "base64",
        );

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of SESSION_KEY (SU5WQUxJRA==) is invalid: decoded length must be 16 or 32",
          );
        });
      });
    });
  });
});

function toEncoding(encoding: BufferEncoding, value: string): string {
  return Buffer.from(value, "utf-8").toString(encoding);
}
