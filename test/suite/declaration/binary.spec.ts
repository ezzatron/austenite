import { Buffer } from "node:buffer";
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

    it("defaults to a required declaration", () => {
      initialize({ onInvalid: noop });

      expect(() => {
        declaration.value();
      }).toThrow(
        "AUSTENITE_BINARY is not set and does not have a default value",
      );
    });

    it("defaults to base64 encoding", () => {
      process.env.AUSTENITE_BINARY = "bGlnaHQgd29y";
      initialize({ onInvalid: noop });

      expect(declaration.value().toString("utf-8")).toEqual("light wor");
    });
  });

  describe("when empty options are supplied", () => {
    beforeEach(() => {
      declaration = binary("AUSTENITE_BINARY", "<description>", {});

      initialize({ onInvalid: noop });
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
        beforeEach(() => {
          declaration = binary("AUSTENITE_BINARY", "<description>", {
            encoding,
          });
          process.env.AUSTENITE_BINARY = encoded;

          initialize({ onInvalid: noop });
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
        beforeEach(() => {
          declaration = binary("AUSTENITE_BINARY", "<description>", {
            encoding,
          });
          process.env.AUSTENITE_BINARY = encoded;

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
        declaration = binary("AUSTENITE_BINARY", "<description>");
        initialize({ onInvalid: noop });
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
        beforeEach(() => {
          declaration = binary("AUSTENITE_BINARY", "<description>", {
            encoding,
            default: undefined,
          });
          process.env.AUSTENITE_BINARY = encoded;

          initialize({ onInvalid: noop });
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
        beforeEach(() => {
          declaration = binary("AUSTENITE_BINARY", "<description>", {
            encoding,
            default: undefined,
          });
          process.env.AUSTENITE_BINARY = encoded;

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
          declaration = binary("AUSTENITE_BINARY", "<description>", {
            default: Buffer.from("<default>", "utf-8"),
          });

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the default", () => {
            expect(declaration.value().toString("utf-8")).toEqual("<default>");
          });
        });
      });

      describe("when there is no default value", () => {
        beforeEach(() => {
          declaration = binary("AUSTENITE_BINARY", "<description>", {
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

  describe("when the declaration has an exact length", () => {
    beforeEach(() => {
      declaration = binary("AUSTENITE_BINARY", "<description>", {
        length: 3,
      });
    });

    describe("when the decoded value is too short", () => {
      beforeEach(() => {
        process.env.AUSTENITE_BINARY = Buffer.from("ab", "utf-8").toString(
          "base64",
        );

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_BINARY (YWI=) is invalid: must have a decoded length of 3, but has a decoded length of 2",
          );
        });
      });
    });

    describe("when the decoded value is too long", () => {
      beforeEach(() => {
        process.env.AUSTENITE_BINARY = Buffer.from("abcd", "utf-8").toString(
          "base64",
        );

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_BINARY (YWJjZA==) is invalid: must have a decoded length of 3, but has a decoded length of 4",
          );
        });
      });
    });

    describe("when the decoded value is the right length", () => {
      beforeEach(() => {
        process.env.AUSTENITE_BINARY = Buffer.from("abc", "utf-8").toString(
          "base64",
        );

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value().toString("utf-8")).toEqual("abc");
        });
      });
    });
  });

  describe("when the declaration has a minimum length", () => {
    beforeEach(() => {
      declaration = binary("AUSTENITE_BINARY", "<description>", {
        length: {
          min: 3,
        },
      });
    });

    describe("when the decoded value is too short", () => {
      beforeEach(() => {
        process.env.AUSTENITE_BINARY = Buffer.from("ab", "utf-8").toString(
          "base64",
        );

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_BINARY (YWI=) is invalid: must have a minimum decoded length of 3, but has a decoded length of 2",
          );
        });
      });
    });

    describe("when the decoded value is long enough", () => {
      beforeEach(() => {
        process.env.AUSTENITE_BINARY = Buffer.from("abc", "utf-8").toString(
          "base64",
        );

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value().toString("utf-8")).toEqual("abc");
        });
      });
    });
  });

  describe("when the declaration has a maximum length", () => {
    beforeEach(() => {
      declaration = binary("AUSTENITE_BINARY", "<description>", {
        length: {
          max: 3,
        },
      });
    });

    describe("when the decoded value is too long", () => {
      beforeEach(() => {
        process.env.AUSTENITE_BINARY = Buffer.from("abcd", "utf-8").toString(
          "base64",
        );

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_BINARY (YWJjZA==) is invalid: must have a maximum decoded length of 3, but has a decoded length of 4",
          );
        });
      });
    });

    describe("when the decoded value is short enough", () => {
      beforeEach(() => {
        process.env.AUSTENITE_BINARY = Buffer.from("abc", "utf-8").toString(
          "base64",
        );

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value().toString("utf-8")).toEqual("abc");
        });
      });
    });
  });

  describe("when the declaration has a minimum and maximum length", () => {
    beforeEach(() => {
      declaration = binary("AUSTENITE_BINARY", "<description>", {
        length: {
          min: 3,
          max: 5,
        },
      });
    });

    describe("when the decoded value is too short", () => {
      beforeEach(() => {
        process.env.AUSTENITE_BINARY = Buffer.from("ab", "utf-8").toString(
          "base64",
        );

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_BINARY (YWI=) is invalid: must have a decoded length between 3 and 5, but has a decoded length of 2",
          );
        });
      });
    });

    describe("when the decoded value is too long", () => {
      beforeEach(() => {
        process.env.AUSTENITE_BINARY = Buffer.from("abcdef", "utf-8").toString(
          "base64",
        );

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_BINARY (YWJjZGVm) is invalid: must have a decoded length between 3 and 5, but has a decoded length of 6",
          );
        });
      });
    });

    describe("when the decoded value is the right length", () => {
      beforeEach(() => {
        process.env.AUSTENITE_BINARY = Buffer.from("abcde", "utf-8").toString(
          "base64",
        );

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value().toString("utf-8")).toEqual("abcde");
        });
      });
    });
  });

  describe("when the declaration has a minimum length that is greater than the maximum length", () => {
    it("throws", () => {
      expect(() => {
        binary("AUSTENITE_BINARY", "<description>", {
          length: {
            min: 5,
            max: 3,
          },
        });
      }).toThrow(
        "specification for AUSTENITE_BINARY is invalid: minimum length (5) is greater than maximum length (3)",
      );
    });
  });
});

function toEncoding(encoding: BufferEncoding, value: string): string {
  return Buffer.from(value, "utf-8").toString(encoding);
}
