import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Declaration } from "../../../src/declaration.js";
import { Options } from "../../../src/declaration/enumeration.js";
import { enumeration, initialize } from "../../../src/index.js";
import { noop } from "../../helpers.js";

describe("Enumeration declarations", () => {
  const members = {
    "<member-0>": {
      value: 0,
      description: "member 0",
    },
    "<member-1>": {
      value: 1,
      description: "member 1",
    },
    "<member-2>": {
      value: 2,
      description: "member 2",
    },
  } as const;

  let declaration: Declaration<0 | 1 | 2, Options<0 | 1 | 2>>;

  describe("when no options are supplied", () => {
    beforeEach(async () => {
      declaration = enumeration(
        "AUSTENITE_ENUMERATION",
        "<description>",
        members,
      );

      await initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow(
        "AUSTENITE_ENUMERATION is not set and does not have a default value",
      );
    });
  });

  describe("when empty options are supplied", () => {
    beforeEach(async () => {
      declaration = enumeration(
        "AUSTENITE_ENUMERATION",
        "<description>",
        members,
        {},
      );

      await initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow(
        "AUSTENITE_ENUMERATION is not set and does not have a default value",
      );
    });
  });

  describe("when the declaration is required", () => {
    beforeEach(() => {
      declaration = enumeration(
        "AUSTENITE_ENUMERATION",
        "<description>",
        members,
      );
    });

    describe.each`
      value           | expected
      ${"<member-0>"} | ${0}
      ${"<member-1>"} | ${1}
      ${"<member-2>"} | ${2}
    `(
      "when the value is one of the members ($value)",
      ({ value, expected }: { value: string; expected: number }) => {
        beforeEach(async () => {
          process.env.AUSTENITE_ENUMERATION = value;

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

    describe("when the value is invalid", () => {
      beforeEach(async () => {
        process.env.AUSTENITE_ENUMERATION = "<non-member>";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_ENUMERATION ('<non-member>') is invalid: expected '<member-0>', '<member-1>', or '<member-2>'",
          );
        });
      });
    });

    describe("when the value is empty", () => {
      beforeEach(async () => {
        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "AUSTENITE_ENUMERATION is not set and does not have a default value",
          );
        });
      });
    });
  });

  describe("when the declaration is optional", () => {
    beforeEach(() => {
      declaration = enumeration(
        "AUSTENITE_ENUMERATION",
        "<description>",
        members,
        {
          default: undefined,
        },
      );
    });

    describe.each`
      value           | expected
      ${"<member-0>"} | ${0}
      ${"<member-1>"} | ${1}
      ${"<member-2>"} | ${2}
    `(
      "when the value is one of the members ($value)",
      ({ value, expected }: { value: string; expected: number }) => {
        beforeEach(async () => {
          process.env.AUSTENITE_ENUMERATION = value;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value", () => {
            expect(declaration.value()).toBe(expected);
          });
        });
      },
    );

    describe("when the value is invalid", () => {
      beforeEach(async () => {
        process.env.AUSTENITE_ENUMERATION = "<non-member>";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_ENUMERATION ('<non-member>') is invalid: expected '<member-0>', '<member-1>', or '<member-2>'",
          );
        });
      });
    });

    describe("when the value is empty", () => {
      describe("when there is a default value", () => {
        beforeEach(async () => {
          declaration = enumeration(
            "AUSTENITE_ENUMERATION",
            "<description>",
            members,
            {
              default: 1,
            },
          );

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the default", () => {
            expect(declaration.value()).toBe(1);
          });
        });
      });

      describe("when there is no default value", () => {
        beforeEach(async () => {
          declaration = enumeration(
            "AUSTENITE_ENUMERATION",
            "<description>",
            members,
            {
              default: undefined,
            },
          );

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

  describe("when a member is empty", () => {
    const members = {
      "<member-0>": {
        value: 0,
        description: "member 0",
      },
      "": {
        value: 1,
        description: "member 1",
      },
    } as const;

    it("throws", () => {
      expect(() => {
        enumeration("AUSTENITE_ENUMERATION", "<description>", members);
      }).toThrow(
        "specification for AUSTENITE_ENUMERATION is invalid: members can not be empty strings",
      );
    });
  });

  describe("when there are less than 2 members", () => {
    const members = {
      "<member-0>": {
        value: 0,
        description: "member 0",
      },
    } as const;

    it("throws", () => {
      expect(() => {
        enumeration("AUSTENITE_ENUMERATION", "<description>", members);
      }).toThrow(
        "specification for AUSTENITE_ENUMERATION is invalid: must have at least 2 members",
      );
    });
  });

  describe("when the declaration has constraints", () => {
    beforeEach(() => {
      declaration = enumeration(
        "AUSTENITE_ENUMERATION",
        "<description>",
        members,
        {
          constraints: [
            {
              description: "<constraint A>",
              constrain: (v) => [0, 1].includes(v) || "value must be 0 or 1",
            },
            {
              description: "<constraint B>",
              constrain: (v) => [1, 2].includes(v) || "value must be 1 or 2",
            },
          ],
          examples: [{ value: 1, label: "example" }],
        },
      );
    });

    describe("when the value satisfies the constraints", () => {
      beforeEach(async () => {
        process.env.AUSTENITE_ENUMERATION = "<member-1>";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value()).toBe(1);
        });
      });
    });

    describe("when the value violates the first constraint", () => {
      beforeEach(async () => {
        process.env.AUSTENITE_ENUMERATION = "<member-2>";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_ENUMERATION ('<member-2>') is invalid: value must be 0 or 1",
          );
        });
      });
    });

    describe("when the value violates the second constraint", () => {
      beforeEach(async () => {
        process.env.AUSTENITE_ENUMERATION = "<member-0>";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_ENUMERATION ('<member-0>') is invalid: value must be 1 or 2",
          );
        });
      });
    });
  });

  describe("when the declaration has the constraints from the README", () => {
    let declaration: Declaration<
      "debug" | "info" | "warn" | "error" | "fatal",
      Options<"debug" | "info" | "warn" | "error" | "fatal">
    >;
    let realPlatform: NodeJS.Platform;

    beforeEach(() => {
      declaration = enumeration(
        "LOG_LEVEL",
        "the minimum log level to record",
        {
          debug: {
            value: "debug",
            description: "show information for developers",
          },
          info: { value: "info", description: "standard log messages" },
          warn: {
            value: "warn",
            description: "important, but don't need individual human review",
          },
          error: {
            value: "error",
            description: "a healthy application shouldn't produce any errors",
          },
          fatal: {
            value: "fatal",
            description: "the application cannot proceed",
          },
        },
        {
          constraints: [
            {
              description: "must not be debug on Windows",
              constrain: (v) =>
                v !== "debug" ||
                process.platform !== "win32" ||
                "must not be debug on Windows",
            },
          ],
          examples: [
            {
              value: "error",
              label: "if you only want to see when things go wrong",
            },
          ],
        },
      );

      realPlatform = process.platform;
    });

    afterEach(() => {
      Object.defineProperty(process, "platform", { value: realPlatform });
    });

    describe("when the value is not debug", () => {
      beforeEach(async () => {
        process.env.LOG_LEVEL = "error";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value()).toBe("error");
        });
      });
    });

    describe("when the value is debug and the platform is not Windows", () => {
      beforeEach(async () => {
        process.env.LOG_LEVEL = "debug";
        Object.defineProperty(process, "platform", { value: "darwin" });

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value()).toBe("debug");
        });
      });
    });

    describe("when the value is debug and the platform is Windows", () => {
      beforeEach(async () => {
        process.env.LOG_LEVEL = "debug";
        Object.defineProperty(process, "platform", { value: "win32" });

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of LOG_LEVEL (debug) is invalid: must not be debug on Windows",
          );
        });
      });
    });
  });
});
