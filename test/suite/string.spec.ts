import { initialize, string } from "../../src";
import { Declaration } from "../../src/declaration";
import { reset } from "../../src/environment";
import { StringOptions } from "../../src/string";
import { hasType, noop } from "../helpers";

describe("String declarations", () => {
  let declaration: Declaration<string, StringOptions>;
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
    beforeEach(() => {
      declaration = string("AUSTENITE_STRING", "<description>");
    });

    it("defaults to a required declaration", () => {
      initialize({ onInvalid: noop });

      expect(() => {
        declaration.value();
      }).toThrow("undefined");
    });
  });

  describe("when empty options are supplied", () => {
    beforeEach(() => {
      declaration = string("AUSTENITE_STRING", "<description>", {});
    });

    it("defaults to a required declaration", () => {
      initialize({ onInvalid: noop });

      expect(() => {
        declaration.value();
      }).toThrow("undefined");
    });
  });

  describe("when the declaration is required", () => {
    beforeEach(() => {
      declaration = string("AUSTENITE_STRING", "<description>");
    });

    describe(".value()", () => {
      it("returns a string value", () => {
        const declaration = string("AUSTENITE_STRING", "<description>");

        process.env.AUSTENITE_STRING = "<value>";
        initialize({ onInvalid: noop });
        const actual = declaration.value();

        expect(hasType<string, typeof actual>(actual)).toBeNull();
      });
    });

    describe("when the value is not empty", () => {
      beforeEach(() => {
        process.env.AUSTENITE_STRING = "<value>";
      });

      describe(".value()", () => {
        it("returns the value", () => {
          initialize({ onInvalid: noop });

          expect(declaration.value()).toBe("<value>");
        });
      });
    });

    describe("when the value is empty", () => {
      describe(".value()", () => {
        it("throws", () => {
          initialize({ onInvalid: noop });

          expect(() => {
            declaration.value();
          }).toThrow("undefined");
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

    describe(".value()", () => {
      it("returns an optional string value", () => {
        const declaration = string("AUSTENITE_STRING", "<description>", {
          default: undefined,
        });

        initialize({ onInvalid: noop });
        const actual = declaration.value();

        expect(hasType<string | undefined, typeof actual>(actual)).toBeNull();
      });
    });

    describe("when the value is not empty", () => {
      beforeEach(() => {
        process.env.AUSTENITE_STRING = "<value>";
      });

      describe(".value()", () => {
        it("returns the value", () => {
          initialize({ onInvalid: noop });

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
        });

        describe(".value()", () => {
          it("returns the default", () => {
            initialize({ onInvalid: noop });

            expect(declaration.value()).toBe("<default>");
          });
        });
      });

      describe("when there is no default value", () => {
        beforeEach(() => {
          declaration = string("AUSTENITE_STRING", "<description>", {
            default: undefined,
          });
        });

        describe(".value()", () => {
          it("returns undefined", () => {
            initialize({ onInvalid: noop });

            expect(declaration.value()).toBeUndefined();
          });
        });
      });
    });
  });
});
