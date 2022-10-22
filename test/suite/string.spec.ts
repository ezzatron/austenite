import { Declaration } from "../../src/declaration";
import { Options, string } from "../../src/declaration/string";
import { initialize, reset } from "../../src/environment";
import { hasType, noop } from "../helpers";

describe("String declarations", () => {
  let declaration: Declaration<string, Options>;
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

      initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow(
        "AUSTENITE_STRING is undefined and does not have a default value"
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
        "AUSTENITE_STRING is undefined and does not have a default value"
      );
    });
  });

  describe("when the declaration is required", () => {
    beforeEach(() => {
      declaration = string("AUSTENITE_STRING", "<description>");
    });

    describe(".value()", () => {
      it("returns a string value", () => {
        // this test is weird because it tests type inference
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
            "AUSTENITE_STRING is undefined and does not have a default value"
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

    describe(".value()", () => {
      it("returns an optional string value", () => {
        // this test is weird because it tests type inference
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
});
