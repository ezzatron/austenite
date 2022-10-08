import { boolean, initialize } from "../../src";
import { reset } from "../../src/environment";
import { hasType, noop } from "../helpers";

describe("Boolean declarations", () => {
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
      const declaration = boolean("AUSTENITE_BOOLEAN", "<description>");

      initialize({ onInvalid: noop });

      expect(() => {
        declaration.value();
      }).toThrow("undefined");
    });
  });

  describe("when empty options are supplied", () => {
    it("defaults to a required declaration", () => {
      const declaration = boolean("AUSTENITE_BOOLEAN", "<description>", {});

      initialize({ onInvalid: noop });

      expect(() => {
        declaration.value();
      }).toThrow("undefined");
    });
  });

  describe("when the declaration is required", () => {
    it("returns a boolean value", () => {
      const declaration = boolean("AUSTENITE_BOOLEAN", "<description>");

      process.env.AUSTENITE_BOOLEAN = "false";
      initialize({ onInvalid: noop });
      const actual = declaration.value();

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
            const declaration = boolean("AUSTENITE_BOOLEAN", "<description>");

            process.env.AUSTENITE_BOOLEAN = value;
            initialize({ onInvalid: noop });

            expect(declaration.value()).toBe(expected);
          }
        );
      });
    });

    describe("when the value is invalid", () => {
      describe(".value()", () => {
        it.each`
          value      | message
          ${"ture"}  | ${"set to ture, expected true or false"}
          ${"flase"} | ${"set to flase, expected true or false"}
        `(
          "throws ($value)",
          ({ value, message }: { value: string; message: string }) => {
            const declaration = boolean("AUSTENITE_BOOLEAN", "<description>");

            process.env.AUSTENITE_BOOLEAN = value;
            initialize({ onInvalid: noop });

            expect(() => {
              declaration.value();
            }).toThrow(message);
          }
        );
      });
    });

    describe("when the value is empty", () => {
      describe(".value()", () => {
        it("throws", () => {
          const declaration = boolean("AUSTENITE_BOOLEAN", "<description>");

          initialize({ onInvalid: noop });

          expect(() => {
            declaration.value();
          }).toThrow("undefined");
        });
      });
    });
  });

  describe("when the declaration is optional", () => {
    it("returns an optional boolean value", () => {
      const declaration = boolean("AUSTENITE_BOOLEAN", "<description>", {
        default: undefined,
      });

      initialize({ onInvalid: noop });
      const actual = declaration.value();

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
            const declaration = boolean("AUSTENITE_BOOLEAN", "<description>", {
              default: undefined,
            });

            process.env.AUSTENITE_BOOLEAN = value;
            initialize({ onInvalid: noop });

            expect(declaration.value()).toBe(expected);
          }
        );
      });
    });

    describe("when the value is invalid", () => {
      describe(".value()", () => {
        it.each`
          value      | message
          ${"ture"}  | ${"set to ture, expected true or false"}
          ${"flase"} | ${"set to flase, expected true or false"}
        `(
          "throws ($value)",
          ({ value, message }: { value: string; message: string }) => {
            const declaration = boolean("AUSTENITE_BOOLEAN", "<description>", {
              default: undefined,
            });

            process.env.AUSTENITE_BOOLEAN = value;
            initialize({ onInvalid: noop });

            expect(() => {
              declaration.value();
            }).toThrow(message);
          }
        );
      });
    });

    describe("when the value is empty", () => {
      describe("when there is a default value", () => {
        describe(".value()", () => {
          it.each([[true], [false]])(
            "returns the default (%s)",
            (d: boolean) => {
              const declaration = boolean(
                "AUSTENITE_BOOLEAN",
                "<description>",
                {
                  default: d,
                }
              );

              initialize({ onInvalid: noop });

              expect(declaration.value()).toBe(d);
            }
          );
        });
      });

      describe("when there is no default value", () => {
        describe(".value()", () => {
          it("returns undefined", () => {
            const declaration = boolean("AUSTENITE_BOOLEAN", "<description>", {
              default: undefined,
            });

            initialize({ onInvalid: noop });

            expect(declaration.value()).toBeUndefined();
          });
        });
      });
    });
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
          const declaration = boolean("AUSTENITE_BOOLEAN", "<description>", {
            literals: {
              true: ["y", "yes"],
              false: ["n", "no"],
            },
          });

          process.env.AUSTENITE_BOOLEAN = value;
          initialize({ onInvalid: noop });

          expect(declaration.value()).toBe(expected);
        }
      );
    });

    describe("when the value does not match a custom literal", () => {
      it.each`
        value      | message
        ${"true"}  | ${"set to true, expected y, yes, n, or no"}
        ${"false"} | ${"set to false, expected y, yes, n, or no"}
      `(
        "throws ($value)",
        ({ value, message }: { value: string; message: string }) => {
          const declaration = boolean("AUSTENITE_BOOLEAN", "<description>", {
            literals: {
              true: ["y", "yes"],
              false: ["n", "no"],
            },
          });

          process.env.AUSTENITE_BOOLEAN = value;
          initialize({ onInvalid: noop });

          expect(() => {
            declaration.value();
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
              false: ["c", "a"],
            },
          });
        }).toThrow(
          'The specification for AUSTENITE_BOOLEAN is invalid: literal "a" can not be used multiple times.'
        );
      });
    });

    describe("when the same literal is used for true multiple times", () => {
      it("throws", () => {
        expect(() => {
          boolean("AUSTENITE_BOOLEAN", "<description>", {
            literals: {
              true: ["a", "a"],
              false: ["b", "c"],
            },
          });
        }).toThrow(
          'The specification for AUSTENITE_BOOLEAN is invalid: literal "a" can not be used multiple times.'
        );
      });
    });
  });
});
