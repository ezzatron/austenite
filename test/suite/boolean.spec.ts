import { Declaration } from "../../src/declaration";
import { boolean, Options } from "../../src/declaration/boolean";
import { initialize, reset } from "../../src/environment";
import { hasType, noop } from "../helpers";

describe("Boolean declarations", () => {
  let declaration: Declaration<boolean, Options>;
  let env: typeof process.env;

  beforeEach(() => {
    jest.spyOn(process, "exit").mockImplementation(() => {
      return undefined as never;
    });

    env = process.env;
    process.env = {};
  });

  afterEach(() => {
    process.env = env;
    reset();
  });

  describe("when no options are supplied", () => {
    beforeEach(() => {
      declaration = boolean("AUSTENITE_BOOLEAN", "<description>");

      initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow(
        "AUSTENITE_BOOLEAN is undefined and does not have a default value"
      );
    });
  });

  describe("when empty options are supplied", () => {
    beforeEach(() => {
      declaration = boolean("AUSTENITE_BOOLEAN", "<description>", {});

      initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow(
        "AUSTENITE_BOOLEAN is undefined and does not have a default value"
      );
    });
  });

  describe("when the declaration is required", () => {
    beforeEach(() => {
      declaration = boolean("AUSTENITE_BOOLEAN", "<description>");
    });

    describe(".value()", () => {
      it("returns a boolean value", () => {
        // this test is weird because it tests type inference
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
        beforeEach(() => {
          process.env.AUSTENITE_BOOLEAN = value;

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value associated with the literal", () => {
            expect(declaration.value()).toBe(expected);
          });

          it("returns the same value when called multiple times", () => {
            expect(declaration.value()).toBe(expected);
            expect(declaration.value()).toBe(expected);
          });
        });
      }
    );

    describe.each`
      value      | expected
      ${"ture"}  | ${"value of AUSTENITE_BOOLEAN (ture) is invalid: expected true or false"}
      ${"flase"} | ${"value of AUSTENITE_BOOLEAN (flase) is invalid: expected true or false"}
    `(
      "when the value is invalid ($value)",
      ({ value, expected }: { value: string; expected: string }) => {
        beforeEach(() => {
          process.env.AUSTENITE_BOOLEAN = value;

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => {
              declaration.value();
            }).toThrow(expected);
          });
        });
      }
    );

    describe("when the value is empty", () => {
      beforeEach(() => {
        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "AUSTENITE_BOOLEAN is undefined and does not have a default value"
          );
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
        // this test is weird because it tests type inference
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
        beforeEach(() => {
          process.env.AUSTENITE_BOOLEAN = value;

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value", () => {
            expect(declaration.value()).toBe(expected);
          });
        });
      }
    );

    describe.each`
      value      | expected
      ${"ture"}  | ${"value of AUSTENITE_BOOLEAN (ture) is invalid: expected true or false"}
      ${"flase"} | ${"value of AUSTENITE_BOOLEAN (flase) is invalid: expected true or false"}
    `(
      "when the value is invalid ($value)",
      ({ value, expected }: { value: string; expected: string }) => {
        beforeEach(() => {
          process.env.AUSTENITE_BOOLEAN = value;

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => {
              declaration.value();
            }).toThrow(expected);
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

            initialize({ onInvalid: noop });
          });

          describe(".value()", () => {
            it("returns the default", () => {
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

  describe("when custom literals are specified", () => {
    beforeEach(() => {
      declaration = boolean("AUSTENITE_BOOLEAN", "<description>", {
        literals: {
          y: true,
          yes: true,
          n: false,
          no: false,
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
        beforeEach(() => {
          process.env.AUSTENITE_BOOLEAN = value;

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value", () => {
            expect(declaration.value()).toBe(expected);
          });
        });
      }
    );

    describe.each`
      value      | expected
      ${"true"}  | ${"value of AUSTENITE_BOOLEAN (true) is invalid: expected y, yes, n, or no"}
      ${"false"} | ${"value of AUSTENITE_BOOLEAN (false) is invalid: expected y, yes, n, or no"}
    `(
      "when the value does not match a custom literal ($value)",
      ({ value, expected }: { value: string; expected: string }) => {
        beforeEach(() => {
          process.env.AUSTENITE_BOOLEAN = value;

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => {
              declaration.value();
            }).toThrow(expected);
          });
        });
      }
    );

    describe("when a true literal is empty", () => {
      const literals = {
        y: true,
        "": true,
        n: false,
        no: false,
      };

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            boolean("AUSTENITE_BOOLEAN", "<description>", {
              literals,
            });
          }).toThrow(
            "specification for AUSTENITE_BOOLEAN is invalid: literals can not be empty strings"
          );
        });
      });
    });

    describe("when a false literal is empty", () => {
      const literals = {
        y: true,
        yes: true,
        n: false,
        "": false,
      };

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            boolean("AUSTENITE_BOOLEAN", "<description>", {
              literals,
            });
          }).toThrow(
            "specification for AUSTENITE_BOOLEAN is invalid: literals can not be empty strings"
          );
        });
      });
    });

    describe("when no true literal is defined", () => {
      const literals = {
        n: false,
        no: false,
      };

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            boolean("AUSTENITE_BOOLEAN", "<description>", {
              literals,
            });
          }).toThrow(
            "specification for AUSTENITE_BOOLEAN is invalid: a true literal must be defined"
          );
        });
      });
    });

    describe("when no false literal is defined", () => {
      const literals = {
        y: true,
        yes: true,
      };

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            boolean("AUSTENITE_BOOLEAN", "<description>", {
              literals,
            });
          }).toThrow(
            "specification for AUSTENITE_BOOLEAN is invalid: a false literal must be defined"
          );
        });
      });
    });
  });
});
