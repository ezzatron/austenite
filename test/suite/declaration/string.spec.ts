import { beforeEach, describe, expect, it } from "vitest";
import { Declaration } from "../../../src/declaration.js";
import { Options } from "../../../src/declaration/string.js";
import { initialize, string } from "../../../src/index.js";
import { noop } from "../../helpers.js";

describe("String declarations", () => {
  let declaration: Declaration<string, Options>;

  describe("when no options are supplied", () => {
    beforeEach(() => {
      declaration = string("AUSTENITE_STRING", "<description>");

      initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow(
        "AUSTENITE_STRING is not set and does not have a default value",
      );
    });
  });

  describe("when empty options are supplied", () => {
    beforeEach(() => {
      declaration = string("AUSTENITE_STRING", "<description>", {});

      initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow(
        "AUSTENITE_STRING is not set and does not have a default value",
      );
    });
  });

  describe("when the declaration is required", () => {
    beforeEach(() => {
      declaration = string("AUSTENITE_STRING", "<description>");
    });

    describe("when the value is not empty", () => {
      beforeEach(() => {
        process.env.AUSTENITE_STRING = "<value>";

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value()).toBe("<value>");
        });

        it("returns the same value when called multiple times", () => {
          expect(declaration.value()).toBe("<value>");
          expect(declaration.value()).toBe("<value>");
        });
      });
    });

    describe("when the value is empty", () => {
      beforeEach(() => {
        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "AUSTENITE_STRING is not set and does not have a default value",
          );
        });
      });
    });
  });

  describe("when the declaration is optional", () => {
    beforeEach(() => {
      declaration = string("AUSTENITE_STRING", "<description>", {
        default: undefined,
      });
    });

    describe("when the value is not empty", () => {
      beforeEach(() => {
        process.env.AUSTENITE_STRING = "<value>";

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value()).toBe("<value>");
        });
      });
    });

    describe("when the value is empty", () => {
      describe("when there is a default value", () => {
        beforeEach(() => {
          declaration = string("AUSTENITE_STRING", "<description>", {
            default: "<default>",
          });

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the default", () => {
            expect(declaration.value()).toBe("<default>");
          });
        });
      });

      describe("when there is no default value", () => {
        beforeEach(() => {
          declaration = string("AUSTENITE_STRING", "<description>", {
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

  describe("when the declaration has constraints", () => {
    beforeEach(() => {
      declaration = string("AUSTENITE_STRING", "<description>", {
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
        examples: [{ value: "abcdef", label: "example" }],
      });
    });

    describe("when the value satisfies the constraints", () => {
      beforeEach(() => {
        process.env.AUSTENITE_STRING = "abcdef";

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value()).toBe("abcdef");
        });
      });
    });

    describe("when the value violates the first constraint", () => {
      beforeEach(() => {
        process.env.AUSTENITE_STRING = "abc";

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_STRING (abc) is invalid: length must be divisible by 2",
          );
        });
      });
    });

    describe("when the value violates the second constraint", () => {
      beforeEach(() => {
        process.env.AUSTENITE_STRING = "ab";

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_STRING (ab) is invalid: length must be divisible by 3",
          );
        });
      });
    });
  });

  describe("when the declaration has the constraints from the README", () => {
    beforeEach(() => {
      declaration = string(
        "READ_DSN",
        "database connection string for read-models",
        {
          constraints: [
            {
              description: "must not contain a password",
              constrain: (v) =>
                !v.includes("password") || "must not contain a password",
            },
          ],
          examples: [
            {
              value: "host=localhost dbname=readmodels user=projector",
              label: "local",
            },
          ],
        },
      );
    });

    describe("when the value satisfies the constraints", () => {
      beforeEach(() => {
        process.env.READ_DSN =
          "host=localhost dbname=readmodels user=projector";

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value()).toBe(
            "host=localhost dbname=readmodels user=projector",
          );
        });
      });
    });

    describe("when the value violates the constraint", () => {
      beforeEach(() => {
        process.env.READ_DSN =
          "host=localhost dbname=readmodels user=projector password=secret";

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of READ_DSN ('host=localhost dbname=readmodels user=projector password=secret') is invalid: must not contain a password",
          );
        });
      });
    });
  });
});
