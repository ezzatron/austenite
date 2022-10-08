import { initialize, string } from "../../src";
import { reset } from "../../src/environment";
import { hasType, noop } from "../helpers";

describe("String declarations", () => {
  let env: typeof process.env;

  beforeEach(() => {
    env = process.env;
    process.env = { ...env };
  });

  afterEach(() => {
    process.env = env;
    reset();
  });

  describe("when no options are supplied", () => {
    it("defaults to a required declaration", () => {
      const declaration = string("AUSTENITE_STRING", "<description>");

      initialize({ onInvalid: noop });

      expect(() => {
        declaration.value();
      }).toThrow("undefined");
    });
  });

  describe("when empty options are supplied", () => {
    it("defaults to a required declaration", () => {
      const declaration = string("AUSTENITE_STRING", "<description>", {});

      initialize({ onInvalid: noop });

      expect(() => {
        declaration.value();
      }).toThrow("undefined");
    });
  });

  describe("when the declaration is required", () => {
    it("returns a string value", () => {
      const declaration = string("AUSTENITE_STRING", "<description>");

      process.env.AUSTENITE_STRING = "<value>";
      initialize({ onInvalid: noop });
      const actual = declaration.value();

      expect(hasType<string, typeof actual>(actual)).toBeNull();
    });

    describe("when the value is not empty", () => {
      describe(".value()", () => {
        it("returns the value", () => {
          const declaration = string("AUSTENITE_STRING", "<description>");

          process.env.AUSTENITE_STRING = "<value>";
          initialize({ onInvalid: noop });

          expect(declaration.value()).toBe("<value>");
        });
      });
    });

    describe("when the value is empty", () => {
      describe(".value()", () => {
        it("throws", () => {
          const declaration = string("AUSTENITE_STRING", "<description>");

          initialize({ onInvalid: noop });

          expect(() => {
            declaration.value();
          }).toThrow("undefined");
        });
      });
    });
  });

  describe("when the declaration is optional", () => {
    it("returns an optional string value", () => {
      const declaration = string("AUSTENITE_STRING", "<description>", {
        default: undefined,
      });

      initialize({ onInvalid: noop });
      const actual = declaration.value();

      expect(hasType<string | undefined, typeof actual>(actual)).toBeNull();
    });

    describe("when the value is not empty", () => {
      describe(".value()", () => {
        it("returns the value", () => {
          const declaration = string("AUSTENITE_STRING", "<description>", {
            default: undefined,
          });

          process.env.AUSTENITE_STRING = "<value>";
          initialize({ onInvalid: noop });

          expect(declaration.value()).toBe("<value>");
        });
      });
    });

    describe("when the value is $label", () => {
      describe("when there is a default value", () => {
        describe(".value()", () => {
          it("returns the default", () => {
            const declaration = string("AUSTENITE_STRING", "<description>", {
              default: "<default>",
            });

            initialize({ onInvalid: noop });

            expect(declaration.value()).toBe("<default>");
          });
        });
      });

      describe("when there is no default value", () => {
        describe(".value()", () => {
          it("returns undefined", () => {
            const declaration = string("AUSTENITE_STRING", "<description>", {
              default: undefined,
            });

            initialize({ onInvalid: noop });

            expect(declaration.value()).toBeUndefined();
          });
        });
      });
    });
  });
});
