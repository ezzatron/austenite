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

  describe("when the declaration has an exact length", () => {
    beforeEach(() => {
      declaration = string("AUSTENITE_STRING", "<description>", {
        length: 3,
      });
    });

    describe("when the value is too short", () => {
      beforeEach(() => {
        process.env.AUSTENITE_STRING = "ab";

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_STRING (ab) is invalid: must have a length of 3, but has a length of 2",
          );
        });
      });
    });

    describe("when the value is too long", () => {
      beforeEach(() => {
        process.env.AUSTENITE_STRING = "abcd";

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_STRING (abcd) is invalid: must have a length of 3, but has a length of 4",
          );
        });
      });
    });

    describe("when the value is the right length", () => {
      beforeEach(() => {
        process.env.AUSTENITE_STRING = "abc";

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value()).toBe("abc");
        });
      });
    });
  });

  describe("when the declaration has a minimum length", () => {
    beforeEach(() => {
      declaration = string("AUSTENITE_STRING", "<description>", {
        length: {
          min: 3,
        },
      });
    });

    describe("when the value is too short", () => {
      beforeEach(() => {
        process.env.AUSTENITE_STRING = "ab";

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_STRING (ab) is invalid: must have a minimum length of 3, but has a length of 2",
          );
        });
      });
    });

    describe("when the value is long enough", () => {
      beforeEach(() => {
        process.env.AUSTENITE_STRING = "abc";

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value()).toBe("abc");
        });
      });
    });
  });

  describe("when the declaration has a maximum length", () => {
    beforeEach(() => {
      declaration = string("AUSTENITE_STRING", "<description>", {
        length: {
          max: 3,
        },
      });
    });

    describe("when the value is too long", () => {
      beforeEach(() => {
        process.env.AUSTENITE_STRING = "abcd";

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_STRING (abcd) is invalid: must have a maximum length of 3, but has a length of 4",
          );
        });
      });
    });

    describe("when the value is short enough", () => {
      beforeEach(() => {
        process.env.AUSTENITE_STRING = "abc";

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value()).toBe("abc");
        });
      });
    });
  });

  describe("when the declaration has a minimum and maximum length", () => {
    beforeEach(() => {
      declaration = string("AUSTENITE_STRING", "<description>", {
        length: {
          min: 3,
          max: 5,
        },
      });
    });

    describe("when the value is too short", () => {
      beforeEach(() => {
        process.env.AUSTENITE_STRING = "ab";

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_STRING (ab) is invalid: must have a length between 3 and 5, but has a length of 2",
          );
        });
      });
    });

    describe("when the value is too long", () => {
      beforeEach(() => {
        process.env.AUSTENITE_STRING = "abcdef";

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_STRING (abcdef) is invalid: must have a length between 3 and 5, but has a length of 6",
          );
        });
      });
    });

    describe("when the value is the right length", () => {
      beforeEach(() => {
        process.env.AUSTENITE_STRING = "abcde";

        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value()).toBe("abcde");
        });
      });
    });
  });

  describe("when the declaration has a minimum length that is greater than the maximum length", () => {
    it("throws", () => {
      expect(() => {
        string("AUSTENITE_STRING", "<description>", {
          length: {
            min: 5,
            max: 3,
          },
        });
      }).toThrow(
        "specification for AUSTENITE_STRING is invalid: minimum length (5) is greater than maximum length (3)",
      );
    });
  });

  describe("when the declaration has a default that violates the length constraints", () => {
    it("throws", () => {
      expect(() => {
        string("AUSTENITE_STRING", "<description>", {
          default: "ab",
          length: 1,
        });
      }).toThrow(
        "specification for AUSTENITE_STRING is invalid: default value: must have a length of 1, but has a length of 2",
      );
    });
  });
});
