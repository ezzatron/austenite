import { boolean, initialize } from "../../src";
import { BooleanOptions } from "../../src/boolean";
import { Declaration } from "../../src/declaration";
import { reset } from "../../src/environment";
import { hasType, noop } from "../helpers";

describe("Boolean declarations", () => {
  let declaration: Declaration<boolean, BooleanOptions>;
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
      declaration = boolean("AUSTENITE_BOOLEAN", "<description>");
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
      declaration = boolean("AUSTENITE_BOOLEAN", "<description>", {});
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
      declaration = boolean("AUSTENITE_BOOLEAN", "<description>");
    });

    describe(".value()", () => {
      it("returns a boolean value", () => {
        const declaration = boolean("AUSTENITE_BOOLEAN", "<description>");

        process.env.AUSTENITE_BOOLEAN = "false";
        initialize({ onInvalid: noop });
        const actual = declaration.value();

        expect(hasType<boolean, typeof actual>(actual)).toBeNull();
      });
    });

    describe.each`
      value      | expected
      ${"true"}  | ${true}
      ${"false"} | ${false}
    `(
      "when the value is one of the accepted literals ($value)",
      ({ value, expected }: { value: string; expected: boolean }) => {
        describe(".value()", () => {
          it("returns the value associated with the literal ($value)", () => {
            process.env.AUSTENITE_BOOLEAN = value;
            initialize({ onInvalid: noop });

            expect(declaration.value()).toBe(expected);
          });
        });
      }
    );

    describe.each`
      value      | message
      ${"ture"}  | ${"set to ture, expected true or false"}
      ${"flase"} | ${"set to flase, expected true or false"}
    `(
      "when the value is invalid ($value)",
      ({ value, message }: { value: string; message: string }) => {
        describe(".value()", () => {
          it("throws", () => {
            process.env.AUSTENITE_BOOLEAN = value;
            initialize({ onInvalid: noop });

            expect(() => {
              declaration.value();
            }).toThrow(message);
          });
        });
      }
    );

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
      declaration = boolean("AUSTENITE_BOOLEAN", "<description>", {
        default: undefined,
      });
    });

    describe(".value()", () => {
      it("returns an optional boolean value", () => {
        const declaration = boolean("AUSTENITE_BOOLEAN", "<description>", {
          default: undefined,
        });

        initialize({ onInvalid: noop });
        const actual = declaration.value();

        expect(hasType<boolean | undefined, typeof actual>(actual)).toBeNull();
      });
    });

    describe.each`
      value      | expected
      ${"true"}  | ${true}
      ${"false"} | ${false}
    `(
      "when the value is one of the accepted literals ($value)",
      ({ value, expected }: { value: string; expected: boolean }) => {
        describe(".value()", () => {
          it("returns the value", () => {
            process.env.AUSTENITE_BOOLEAN = value;
            initialize({ onInvalid: noop });

            expect(declaration.value()).toBe(expected);
          });
        });
      }
    );

    describe.each`
      value      | message
      ${"ture"}  | ${"set to ture, expected true or false"}
      ${"flase"} | ${"set to flase, expected true or false"}
    `(
      "when the value is invalid ($value)",
      ({ value, message }: { value: string; message: string }) => {
        describe(".value()", () => {
          it("throws", () => {
            process.env.AUSTENITE_BOOLEAN = value;
            initialize({ onInvalid: noop });

            expect(() => {
              declaration.value();
            }).toThrow(message);
          });
        });
      }
    );

    describe("when the value is empty", () => {
      describe.each([[true], [false]])(
        "when there is a default value (%s)",
        (def: boolean) => {
          beforeEach(() => {
            declaration = boolean("AUSTENITE_BOOLEAN", "<description>", {
              default: def,
            });
          });

          describe(".value()", () => {
            it("returns the default", () => {
              initialize({ onInvalid: noop });

              expect(declaration.value()).toBe(def);
            });
          });
        }
      );

      describe("when there is no default value", () => {
        beforeEach(() => {
          declaration = boolean("AUSTENITE_BOOLEAN", "<description>", {
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

  describe("when custom literals are specified", () => {
    beforeEach(() => {
      declaration = boolean("AUSTENITE_BOOLEAN", "<description>", {
        literals: {
          true: ["y", "yes"],
          false: ["n", "no"],
        },
      });
    });

    describe.each`
      value    | expected
      ${"y"}   | ${true}
      ${"yes"} | ${true}
      ${"n"}   | ${false}
      ${"no"}  | ${false}
    `(
      "when the value matches a custom literal ($value)",
      ({ value, expected }: { value: string; expected: boolean }) => {
        describe(".value()", () => {
          it("returns the value", () => {
            process.env.AUSTENITE_BOOLEAN = value;
            initialize({ onInvalid: noop });

            expect(declaration.value()).toBe(expected);
          });
        });
      }
    );

    describe.each`
      value      | message
      ${"true"}  | ${"set to true, expected y, yes, n, or no"}
      ${"false"} | ${"set to false, expected y, yes, n, or no"}
    `(
      "when the value does not match a custom literal ($value)",
      ({ value, message }: { value: string; message: string }) => {
        describe(".value()", () => {
          it("throws", () => {
            process.env.AUSTENITE_BOOLEAN = value;
            initialize({ onInvalid: noop });

            expect(() => {
              declaration.value();
            }).toThrow(message);
          });
        });
      }
    );

    describe("when a true literal is empty", () => {
      describe(".value()", () => {
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
    });

    describe("when a false literal is empty", () => {
      describe(".value()", () => {
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
    });

    describe("when the same literal is specified for both true and false", () => {
      describe(".value()", () => {
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
    });

    describe("when the same literal is used for true multiple times", () => {
      describe(".value()", () => {
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
});
