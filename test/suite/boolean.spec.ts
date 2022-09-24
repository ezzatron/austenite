import { boolean, initialize } from "../../src";
import { reset } from "../../src/environment";
import { hasType } from "../helpers";

describe("Boolean variables", () => {
  let env: typeof process.env;

  beforeEach(() => {
    env = process.env;
    process.env = { ...env };

    jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    jest.resetAllMocks();
    process.env = env;
    reset();
  });

  describe("when no options are supplied", () => {
    it("defaults to a required variable", () => {
      const variable = boolean("AUSTENITE_BOOLEAN", "<description>");

      initialize();

      expect(() => {
        variable.value();
      }).toThrow(
        "AUSTENITE_BOOLEAN is undefined and does not have a default value."
      );
    });
  });

  describe("when empty options are supplied", () => {
    it("defaults to a required variable", () => {
      const variable = boolean("AUSTENITE_BOOLEAN", "<description>", {});

      initialize();

      expect(() => {
        variable.value();
      }).toThrow(
        "AUSTENITE_BOOLEAN is undefined and does not have a default value."
      );
    });
  });

  describe("when the variable is required", () => {
    it("returns a boolean value", () => {
      const variable = boolean("AUSTENITE_BOOLEAN", "<description>", {
        required: true,
      });

      process.env.AUSTENITE_BOOLEAN = "false";
      initialize();
      const actual = variable.value();

      expect(hasType<boolean, typeof actual>(actual)).toBeNull();
    });

    describe("when the value is one of the accepted literals", () => {
      describe(".value()", () => {
        it.each`
          value      | expected
          ${"true"}  | ${true}
          ${"false"} | ${false}
        `(
          "returns the value associated with the literal ($value)",
          ({ value, expected }: { value: string; expected: boolean }) => {
            const variable = boolean("AUSTENITE_BOOLEAN", "<description>", {
              required: true,
            });

            process.env.AUSTENITE_BOOLEAN = value;
            initialize();

            expect(variable.value()).toBe(expected);
          }
        );
      });
    });

    describe("when the value is invalid", () => {
      describe(".value()", () => {
        it.each`
          value      | message
          ${"ture"}  | ${'The value of AUSTENITE_BOOLEAN ("ture") is invalid: expected "true" or "false".'}
          ${"flase"} | ${'The value of AUSTENITE_BOOLEAN ("flase") is invalid: expected "true" or "false".'}
        `(
          "throws ($value)",
          ({ value, message }: { value: string; message: string }) => {
            const variable = boolean("AUSTENITE_BOOLEAN", "<description>", {
              required: true,
            });

            process.env.AUSTENITE_BOOLEAN = value;
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
            it.each([[true], [false]])(
              "returns the default (%s)",
              (d: boolean) => {
                const variable = boolean("AUSTENITE_BOOLEAN", "<description>", {
                  required: true,
                  default: d,
                });

                if (emptyValue != null) {
                  process.env.AUSTENITE_BOOLEAN = emptyValue;
                }

                initialize();

                expect(variable.value()).toBe(d);
              }
            );
          });
        });

        describe("when there is no default value", () => {
          describe(".value()", () => {
            it("throws", () => {
              const variable = boolean("AUSTENITE_BOOLEAN", "<description>", {
                required: true,
              });

              initialize();

              expect(() => {
                variable.value();
              }).toThrow(
                "AUSTENITE_BOOLEAN is undefined and does not have a default value."
              );
            });
          });
        });
      }
    );
  });

  describe("when the variable is optional", () => {
    it("returns an optional boolean value", () => {
      const variable = boolean("AUSTENITE_BOOLEAN", "<description>", {
        required: false,
      });

      initialize();
      const actual = variable.value();

      expect(hasType<boolean | undefined, typeof actual>(actual)).toBeNull();
    });

    describe("when the value is one of the accepted literals", () => {
      describe(".value()", () => {
        it.each`
          value      | expected
          ${"true"}  | ${true}
          ${"false"} | ${false}
        `(
          "returns the value ($value)",
          ({ value, expected }: { value: string; expected: boolean }) => {
            const variable = boolean("AUSTENITE_BOOLEAN", "<description>", {
              required: false,
            });

            process.env.AUSTENITE_BOOLEAN = value;
            initialize();

            expect(variable.value()).toBe(expected);
          }
        );
      });
    });

    describe("when the value is invalid", () => {
      describe(".value()", () => {
        it.each`
          value      | message
          ${"ture"}  | ${'The value of AUSTENITE_BOOLEAN ("ture") is invalid: expected "true" or "false".'}
          ${"flase"} | ${'The value of AUSTENITE_BOOLEAN ("flase") is invalid: expected "true" or "false".'}
        `(
          "throws ($value)",
          ({ value, message }: { value: string; message: string }) => {
            const variable = boolean("AUSTENITE_BOOLEAN", "<description>", {
              required: false,
            });

            process.env.AUSTENITE_BOOLEAN = value;
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
            it.each([[true], [false]])(
              "returns the default (%s)",
              (d: boolean) => {
                const variable = boolean("AUSTENITE_BOOLEAN", "<description>", {
                  required: false,
                  default: d,
                });

                if (emptyValue != null) {
                  process.env.AUSTENITE_BOOLEAN = emptyValue;
                }

                initialize();

                expect(variable.value()).toBe(d);
              }
            );
          });
        });

        describe("when there is no default value", () => {
          describe(".value()", () => {
            it("returns undefined", () => {
              const variable = boolean("AUSTENITE_BOOLEAN", "<description>", {
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
          const variable = boolean("AUSTENITE_BOOLEAN", "<description>", {
            literals: {
              true: ["y", "yes"],
              false: ["n", "no"],
            },
          });

          process.env.AUSTENITE_BOOLEAN = value;
          initialize();

          expect(variable.value()).toBe(expected);
        }
      );
    });

    describe("when the value does not match a custom literal", () => {
      it.each`
        value      | message
        ${"true"}  | ${'The value of AUSTENITE_BOOLEAN ("true") is invalid: expected "y", "yes", "n", or "no".'}
        ${"false"} | ${'The value of AUSTENITE_BOOLEAN ("false") is invalid: expected "y", "yes", "n", or "no".'}
      `(
        "throws ($value)",
        ({ value, message }: { value: string; message: string }) => {
          const variable = boolean("AUSTENITE_BOOLEAN", "<description>", {
            literals: {
              true: ["y", "yes"],
              false: ["n", "no"],
            },
          });

          process.env.AUSTENITE_BOOLEAN = value;
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
          boolean("AUSTENITE_BOOLEAN", "<description>", {
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
          boolean("AUSTENITE_BOOLEAN", "<description>", {
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
          boolean("AUSTENITE_BOOLEAN", "<description>", {
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
