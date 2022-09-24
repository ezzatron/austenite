import { initialize, string } from "../../src";
import { reset } from "../../src/environment";
import { hasType } from "../helpers";

describe("String variables", () => {
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
    it("defaults to a required variable", () => {
      const variable = string("AUSTENITE_STRING", "<description>");

      initialize();

      expect(() => {
        variable.value();
      }).toThrow(
        "AUSTENITE_STRING is undefined and does not have a default value."
      );
    });
  });

  describe("when empty options are supplied", () => {
    it("defaults to a required variable", () => {
      const variable = string("AUSTENITE_STRING", "<description>", {});

      initialize();

      expect(() => {
        variable.value();
      }).toThrow(
        "AUSTENITE_STRING is undefined and does not have a default value."
      );
    });
  });

  describe("when the variable is required", () => {
    it("returns a string value", () => {
      const variable = string("AUSTENITE_STRING", "<description>", {
        required: true,
      });

      process.env.AUSTENITE_STRING = "<value>";
      initialize();
      const actual = variable.value();

      expect(hasType<string, typeof actual>(actual)).toBeNull();
    });

    describe("when the value is not empty", () => {
      describe(".value()", () => {
        it("returns the value", () => {
          const variable = string("AUSTENITE_STRING", "<description>", {
            required: true,
          });

          process.env.AUSTENITE_STRING = "<value>";
          initialize();

          expect(variable.value()).toBe("<value>");
        });
      });
    });

    describe.each`
      label          | emptyValue
      ${"undefined"} | ${undefined}
      ${"empty"}     | ${""}
    `(
      "when the value is $label",
      ({ emptyValue }: { emptyValue: string | undefined }) => {
        describe("when there is a default value", () => {
          describe(".value()", () => {
            it("returns the default", () => {
              const variable = string("AUSTENITE_STRING", "<description>", {
                required: true,
                default: "<default>",
              });

              if (emptyValue != null) process.env.AUSTENITE_STRING = emptyValue;
              initialize();

              expect(variable.value()).toBe("<default>");
            });
          });
        });

        describe("when there is no default value", () => {
          describe(".value()", () => {
            it("throws", () => {
              const variable = string("AUSTENITE_STRING", "<description>", {
                required: true,
              });

              initialize();

              expect(() => {
                variable.value();
              }).toThrow(
                "AUSTENITE_STRING is undefined and does not have a default value."
              );
            });
          });
        });
      }
    );
  });

  describe("when the variable is optional", () => {
    it("returns an optional string value", () => {
      const variable = string("AUSTENITE_STRING", "<description>", {
        required: false,
      });

      initialize();
      const actual = variable.value();

      expect(hasType<string | undefined, typeof actual>(actual)).toBeNull();
    });

    describe("when the value is not empty", () => {
      describe(".value()", () => {
        it("returns the value", () => {
          const variable = string("AUSTENITE_STRING", "<description>", {
            required: false,
          });

          process.env.AUSTENITE_STRING = "<value>";
          initialize();

          expect(variable.value()).toBe("<value>");
        });
      });
    });

    describe.each`
      label          | emptyValue
      ${"undefined"} | ${undefined}
      ${"empty"}     | ${""}
    `(
      "when the value is $label",
      ({ emptyValue }: { emptyValue: string | undefined }) => {
        describe("when there is a default value", () => {
          describe(".value()", () => {
            it("returns the default", () => {
              const variable = string("AUSTENITE_STRING", "<description>", {
                required: false,
                default: "<default>",
              });

              if (emptyValue != null) {
                process.env.AUSTENITE_STRING = emptyValue;
              }

              initialize();

              expect(variable.value()).toBe("<default>");
            });
          });
        });

        describe("when there is no default value", () => {
          describe(".value()", () => {
            it("returns undefined", () => {
              const variable = string("AUSTENITE_STRING", "<description>", {
                required: false,
              });

              initialize();

              expect(variable.value()).toBeUndefined();
            });
          });
        });
      }
    );
  });
});
