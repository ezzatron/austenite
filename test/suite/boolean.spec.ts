import { boolean, initialize } from "../../src";
import { hasType } from "../helpers";

describe("Boolean variables", () => {
  let env: typeof process.env;

  beforeEach(() => {
    env = process.env;
    process.env = { ...env };
  });

  afterEach(() => {
    process.env = env;
  });

  describe("when no options are supplied", () => {
    it("defaults to a required variable", () => {
      const variable = boolean("AUSTENITE_BOOLEAN_A", "description-a");

      initialize();

      expect(() => {
        variable.value();
      }).toThrow(
        "AUSTENITE_BOOLEAN_A is undefined and does not have a default value."
      );
    });
  });

  describe("when empty options are supplied", () => {
    it("defaults to a required variable", () => {
      const variable = boolean("AUSTENITE_BOOLEAN_A", "description-a", {});

      initialize();

      expect(() => {
        variable.value();
      }).toThrow(
        "AUSTENITE_BOOLEAN_A is undefined and does not have a default value."
      );
    });
  });

  describe("when the variable is required", () => {
    it("returns a boolean value", () => {
      const variable = boolean("AUSTENITE_BOOLEAN_A", "description-a", {
        required: true,
      });

      process.env.AUSTENITE_BOOLEAN_A = "false";
      initialize();
      const actual = variable.value();

      expect(hasType<boolean, typeof actual>(actual)).toBeNull();
    });

    describe("when the value is one of the accepted literals", () => {
      describe(".value()", () => {
        it.each`
          name                     | value      | expected
          ${"AUSTENITE_BOOLEAN_A"} | ${"true"}  | ${true}
          ${"AUSTENITE_BOOLEAN_B"} | ${"false"} | ${false}
        `(
          "returns the value associated with the literal ($value)",
          ({
            name,
            value,
            expected,
          }: {
            name: string;
            value: string;
            expected: boolean;
          }) => {
            const variable = boolean(name, "description-a", { required: true });

            process.env[name] = value;
            initialize();

            expect(variable.value()).toBe(expected);
          }
        );
      });
    });

    describe("when the value is invalid", () => {
      describe(".value()", () => {
        it.each`
          name                     | value      | message
          ${"AUSTENITE_BOOLEAN_A"} | ${"ture"}  | ${'The value of AUSTENITE_BOOLEAN_A ("ture") is invalid: expected "true" or "false".'}
          ${"AUSTENITE_BOOLEAN_B"} | ${"flase"} | ${'The value of AUSTENITE_BOOLEAN_B ("flase") is invalid: expected "true" or "false".'}
        `(
          "throws ($name)",
          ({
            name,
            value,
            message,
          }: {
            name: string;
            value: string;
            message: string;
          }) => {
            const variable = boolean(name, "description-a", {
              required: true,
            });

            process.env[name] = value;
            initialize();

            expect(() => {
              variable.value();
            }).toThrow(message);
          }
        );
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
            it.each`
              name                     | default
              ${"AUSTENITE_BOOLEAN_A"} | ${true}
              ${"AUSTENITE_BOOLEAN_B"} | ${false}
            `(
              "returns the default ($default)",
              ({ name, default: d }: { name: string; default: boolean }) => {
                const variable = boolean(name, "description-a", {
                  required: true,
                  default: d,
                });

                if (emptyValue != null) process.env[name] = emptyValue;
                initialize();

                expect(variable.value()).toBe(d);
              }
            );
          });
        });

        describe("when there is no default value", () => {
          describe(".value()", () => {
            it.each`
              name                     | message
              ${"AUSTENITE_BOOLEAN_A"} | ${"AUSTENITE_BOOLEAN_A is undefined and does not have a default value."}
              ${"AUSTENITE_BOOLEAN_B"} | ${"AUSTENITE_BOOLEAN_B is undefined and does not have a default value."}
            `(
              "throws ($name)",
              ({ name, message }: { name: string; message: string }) => {
                const variable = boolean(name, "description-a", {
                  required: true,
                });

                initialize();

                expect(() => {
                  variable.value();
                }).toThrow(message);
              }
            );
          });
        });
      }
    );
  });

  describe("when the variable is optional", () => {
    it("returns an optional boolean value", () => {
      const variable = boolean("AUSTENITE_BOOLEAN_A", "description-a", {
        required: false,
      });

      initialize();
      const actual = variable.value();

      expect(hasType<boolean | undefined, typeof actual>(actual)).toBeNull();
    });

    describe("when the value is one of the accepted literals", () => {
      describe(".value()", () => {
        it.each`
          name                     | value      | expected
          ${"AUSTENITE_BOOLEAN_A"} | ${"true"}  | ${true}
          ${"AUSTENITE_BOOLEAN_B"} | ${"false"} | ${false}
        `(
          "returns the value ($value)",
          ({
            name,
            value,
            expected,
          }: {
            name: string;
            value: string;
            expected: boolean;
          }) => {
            const variable = boolean(name, "description-a", {
              required: false,
            });

            process.env[name] = value;
            initialize();

            expect(variable.value()).toBe(expected);
          }
        );
      });
    });

    describe("when the value is invalid", () => {
      describe(".value()", () => {
        it.each`
          name                     | value      | message
          ${"AUSTENITE_BOOLEAN_A"} | ${"ture"}  | ${'The value of AUSTENITE_BOOLEAN_A ("ture") is invalid: expected "true" or "false".'}
          ${"AUSTENITE_BOOLEAN_B"} | ${"flase"} | ${'The value of AUSTENITE_BOOLEAN_B ("flase") is invalid: expected "true" or "false".'}
        `(
          "throws ($value)",
          ({
            name,
            value,
            message,
          }: {
            name: string;
            value: string;
            message: string;
          }) => {
            const variable = boolean(name, "description-a", {
              required: false,
            });

            process.env[name] = value;
            initialize();

            expect(() => {
              variable.value();
            }).toThrow(message);
          }
        );
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
            it.each`
              name                     | default
              ${"AUSTENITE_BOOLEAN_A"} | ${true}
              ${"AUSTENITE_BOOLEAN_B"} | ${false}
            `(
              "returns the default ($default)",
              ({ name, default: d }: { name: string; default: boolean }) => {
                const variable = boolean(name, "description-a", {
                  required: false,
                  default: d,
                });

                if (emptyValue != null) process.env[name] = emptyValue;
                initialize();

                expect(variable.value()).toBe(d);
              }
            );
          });
        });

        describe("when there is no default value", () => {
          describe(".value()", () => {
            it.each`
              name
              ${"AUSTENITE_BOOLEAN_A"}
              ${"AUSTENITE_BOOLEAN_B"}
            `("returns undefined ($name)", ({ name }: { name: string }) => {
              const variable = boolean(name, "description-a", {
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

  describe("when custom literals are specified", () => {
    describe("when the value matches a custom literal", () => {
      it.each`
        value    | expected
        ${"y"}   | ${true}
        ${"yes"} | ${true}
        ${"n"}   | ${false}
        ${"no"}  | ${false}
      `(
        "returns the value ($value)",
        ({ value, expected }: { value: string; expected: boolean }) => {
          const variable = boolean("AUSTENITE_BOOLEAN_A", "description-a", {
            literals: {
              true: ["y", "yes"],
              false: ["n", "no"],
            },
          });

          process.env.AUSTENITE_BOOLEAN_A = value;
          initialize();

          expect(variable.value()).toBe(expected);
        }
      );
    });

    describe("when the value does not match a custom literal", () => {
      it.each`
        value      | message
        ${"true"}  | ${'The value of AUSTENITE_BOOLEAN_A ("true") is invalid: expected "y", "yes", "n", or "no".'}
        ${"ture"}  | ${'The value of AUSTENITE_BOOLEAN_A ("ture") is invalid: expected "y", "yes", "n", or "no".'}
        ${"false"} | ${'The value of AUSTENITE_BOOLEAN_A ("false") is invalid: expected "y", "yes", "n", or "no".'}
        ${"flase"} | ${'The value of AUSTENITE_BOOLEAN_A ("flase") is invalid: expected "y", "yes", "n", or "no".'}
      `(
        "throws ($value)",
        ({ value, message }: { value: string; message: string }) => {
          const variable = boolean("AUSTENITE_BOOLEAN_A", "description-a", {
            literals: {
              true: ["y", "yes"],
              false: ["n", "no"],
            },
          });

          process.env.AUSTENITE_BOOLEAN_A = value;
          initialize();

          expect(() => {
            variable.value();
          }).toThrow(message);
        }
      );
    });

    describe("when a true literal is empty", () => {
      it("throws", () => {
        expect(() => {
          boolean("AUSTENITE_BOOLEAN", "description-a", {
            literals: {
              true: ["y", ""],
              false: ["n", "no"],
            },
          });
        }).toThrow(
          "The specification for AUSTENITE_BOOLEAN is invalid: literals can not be an empty string."
        );
      });
    });

    describe("when a false literal is empty", () => {
      it("throws", () => {
        expect(() => {
          boolean("AUSTENITE_BOOLEAN", "description-a", {
            literals: {
              true: ["y", "yes"],
              false: ["n", ""],
            },
          });
        }).toThrow(
          "The specification for AUSTENITE_BOOLEAN is invalid: literals can not be an empty string."
        );
      });
    });

    describe("when the same literal is specified for both true and false", () => {
      it("throws", () => {
        expect(() => {
          boolean("AUSTENITE_BOOLEAN", "description-a", {
            literals: {
              true: ["a", "b"],
              false: ["b", "d"],
            },
          });
        }).toThrow(
          'The specification for AUSTENITE_BOOLEAN is invalid: literal "b" can not be both true and false.'
        );
      });
    });
  });
});
