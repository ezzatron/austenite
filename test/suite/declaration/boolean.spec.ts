import { boolean } from "austenite";
import { initialize } from "austenite/node";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { DeclarationFromOptions } from "../../../src/declaration.js";
import { Options } from "../../../src/declaration/boolean.js";
import { noop } from "../../helpers.js";

describe("Boolean declarations", () => {
  let declaration: DeclarationFromOptions<boolean, Options>;

  describe("when no options are supplied", () => {
    beforeEach(async () => {
      declaration = boolean("AUSTENITE_BOOLEAN", "<description>");

      await initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow(
        "AUSTENITE_BOOLEAN is not set and does not have a default value",
      );
    });
  });

  describe("when empty options are supplied", () => {
    beforeEach(async () => {
      declaration = boolean("AUSTENITE_BOOLEAN", "<description>", {});

      await initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow(
        "AUSTENITE_BOOLEAN is not set and does not have a default value",
      );
    });
  });

  describe("when the declaration is required", () => {
    beforeEach(() => {
      declaration = boolean("AUSTENITE_BOOLEAN", "<description>");
    });

    describe.each`
      value      | expected
      ${"true"}  | ${true}
      ${"false"} | ${false}
    `(
      "when the value is one of the accepted literals ($value)",
      ({ value, expected }: { value: string; expected: boolean }) => {
        beforeEach(async () => {
          process.env.AUSTENITE_BOOLEAN = value;

          await initialize({ onInvalid: noop });
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
      },
    );

    describe.each`
      value      | expected
      ${"ture"}  | ${"value of AUSTENITE_BOOLEAN (ture) is invalid: expected true or false"}
      ${"flase"} | ${"value of AUSTENITE_BOOLEAN (flase) is invalid: expected true or false"}
    `(
      "when the value is invalid ($value)",
      ({ value, expected }: { value: string; expected: string }) => {
        beforeEach(async () => {
          process.env.AUSTENITE_BOOLEAN = value;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => {
              declaration.value();
            }).toThrow(expected);
          });
        });
      },
    );

    describe("when the value is empty", () => {
      beforeEach(async () => {
        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "AUSTENITE_BOOLEAN is not set and does not have a default value",
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

    describe.each`
      value      | expected
      ${"true"}  | ${true}
      ${"false"} | ${false}
    `(
      "when the value is one of the accepted literals ($value)",
      ({ value, expected }: { value: string; expected: boolean }) => {
        beforeEach(async () => {
          process.env.AUSTENITE_BOOLEAN = value;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value", () => {
            expect(declaration.value()).toBe(expected);
          });
        });
      },
    );

    describe.each`
      value      | expected
      ${"ture"}  | ${"value of AUSTENITE_BOOLEAN (ture) is invalid: expected true or false"}
      ${"flase"} | ${"value of AUSTENITE_BOOLEAN (flase) is invalid: expected true or false"}
    `(
      "when the value is invalid ($value)",
      ({ value, expected }: { value: string; expected: string }) => {
        beforeEach(async () => {
          process.env.AUSTENITE_BOOLEAN = value;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => {
              declaration.value();
            }).toThrow(expected);
          });
        });
      },
    );

    describe("when the value is empty", () => {
      describe.each([[true], [false]])(
        "when there is a default value (%s)",
        (def: boolean) => {
          beforeEach(async () => {
            declaration = boolean("AUSTENITE_BOOLEAN", "<description>", {
              default: def,
            });

            await initialize({ onInvalid: noop });
          });

          describe(".value()", () => {
            it("returns the default", () => {
              expect(declaration.value()).toBe(def);
            });
          });
        },
      );

      describe("when there is no default value", () => {
        beforeEach(async () => {
          declaration = boolean("AUSTENITE_BOOLEAN", "<description>", {
            default: undefined,
          });

          await initialize({ onInvalid: noop });
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
        beforeEach(async () => {
          process.env.AUSTENITE_BOOLEAN = value;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value", () => {
            expect(declaration.value()).toBe(expected);
          });
        });
      },
    );

    describe.each`
      value      | expected
      ${"true"}  | ${"value of AUSTENITE_BOOLEAN (true) is invalid: expected y, yes, n, or no"}
      ${"false"} | ${"value of AUSTENITE_BOOLEAN (false) is invalid: expected y, yes, n, or no"}
    `(
      "when the value does not match a custom literal ($value)",
      ({ value, expected }: { value: string; expected: string }) => {
        beforeEach(async () => {
          process.env.AUSTENITE_BOOLEAN = value;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => {
              declaration.value();
            }).toThrow(expected);
          });
        });
      },
    );

    describe("when a true literal is empty", () => {
      const literals = {
        y: true,
        "": true,
        n: false,
        no: false,
      };

      it("throws", () => {
        expect(() => {
          boolean("AUSTENITE_BOOLEAN", "<description>", {
            literals,
          });
        }).toThrow(
          "specification for AUSTENITE_BOOLEAN is invalid: literals can not be empty strings",
        );
      });
    });

    describe("when a false literal is empty", () => {
      const literals = {
        y: true,
        yes: true,
        n: false,
        "": false,
      };

      it("throws", () => {
        expect(() => {
          boolean("AUSTENITE_BOOLEAN", "<description>", {
            literals,
          });
        }).toThrow(
          "specification for AUSTENITE_BOOLEAN is invalid: literals can not be empty strings",
        );
      });
    });

    describe("when no true literal is defined", () => {
      const literals = {
        n: false,
        no: false,
      };

      it("throws", () => {
        expect(() => {
          boolean("AUSTENITE_BOOLEAN", "<description>", {
            literals,
          });
        }).toThrow(
          "specification for AUSTENITE_BOOLEAN is invalid: a true literal must be defined",
        );
      });
    });

    describe("when no false literal is defined", () => {
      const literals = {
        y: true,
        yes: true,
      };

      it("throws", () => {
        expect(() => {
          boolean("AUSTENITE_BOOLEAN", "<description>", {
            literals,
          });
        }).toThrow(
          "specification for AUSTENITE_BOOLEAN is invalid: a false literal must be defined",
        );
      });
    });
  });

  describe("when the declaration has constraints", () => {
    beforeEach(() => {
      declaration = boolean("AUSTENITE_BOOLEAN", "<description>", {
        constraints: [
          {
            description: "<constraint A>",
            constrain: (v) => v || "value must be true",
          },
        ],
        examples: [{ value: true, label: "example" }],
      });
    });

    describe("when the value satisfies the constraints", () => {
      beforeEach(async () => {
        process.env.AUSTENITE_BOOLEAN = "true";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value()).toBe(true);
        });
      });
    });

    describe("when the value violates a constraint", () => {
      beforeEach(async () => {
        process.env.AUSTENITE_BOOLEAN = "false";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_BOOLEAN (false) is invalid: value must be true",
          );
        });
      });
    });
  });

  describe("when the declaration has the constraints from the README", () => {
    let realPlatform: NodeJS.Platform;

    beforeEach(() => {
      declaration = boolean("DEBUG", "enable or disable debugging features", {
        constraints: [
          {
            description: "must not be enabled on Windows",
            constrain: (v) =>
              !v ||
              process.platform !== "win32" ||
              "must not be enabled on Windows",
          },
        ],
        examples: [{ value: false, label: "disabled" }],
      });

      realPlatform = process.platform;
    });

    afterEach(() => {
      Object.defineProperty(process, "platform", { value: realPlatform });
    });

    describe("when the value is false", () => {
      beforeEach(async () => {
        process.env.DEBUG = "false";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value()).toBe(false);
        });
      });
    });

    describe("when the value is true and the platform is not Windows", () => {
      beforeEach(async () => {
        process.env.DEBUG = "true";
        Object.defineProperty(process, "platform", { value: "darwin" });

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value()).toBe(true);
        });
      });
    });

    describe("when the value is true and the platform is Windows", () => {
      beforeEach(async () => {
        process.env.DEBUG = "true";
        Object.defineProperty(process, "platform", { value: "win32" });

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of DEBUG (true) is invalid: must not be enabled on Windows",
          );
        });
      });
    });
  });
});
