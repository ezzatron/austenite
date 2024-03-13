import { beforeEach, describe, expect, it } from "vitest";
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

  let declaration: Declaration<number, Options<number>>;

  describe("when no options are supplied", () => {
    beforeEach(() => {
      declaration = enumeration(
        "AUSTENITE_ENUMERATION",
        "<description>",
        members,
      );

      initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow(
        "AUSTENITE_ENUMERATION is undefined and does not have a default value",
      );
    });
  });

  describe("when empty options are supplied", () => {
    beforeEach(() => {
      declaration = enumeration(
        "AUSTENITE_ENUMERATION",
        "<description>",
        members,
        {},
      );

      initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow(
        "AUSTENITE_ENUMERATION is undefined and does not have a default value",
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
        beforeEach(() => {
          process.env.AUSTENITE_ENUMERATION = value;

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
      },
    );

    describe("when the value is invalid", () => {
      beforeEach(() => {
        process.env.AUSTENITE_ENUMERATION = "<non-member>";

        initialize({ onInvalid: noop });
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
      beforeEach(() => {
        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "AUSTENITE_ENUMERATION is undefined and does not have a default value",
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
        beforeEach(() => {
          process.env.AUSTENITE_ENUMERATION = value;

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value", () => {
            expect(declaration.value()).toBe(expected);
          });
        });
      },
    );

    describe("when the value is invalid", () => {
      beforeEach(() => {
        process.env.AUSTENITE_ENUMERATION = "<non-member>";

        initialize({ onInvalid: noop });
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
        beforeEach(() => {
          declaration = enumeration(
            "AUSTENITE_ENUMERATION",
            "<description>",
            members,
            {
              default: 1,
            },
          );

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the default", () => {
            expect(declaration.value()).toBe(1);
          });
        });
      });

      describe("when there is no default value", () => {
        beforeEach(() => {
          declaration = enumeration(
            "AUSTENITE_ENUMERATION",
            "<description>",
            members,
            {
              default: undefined,
            },
          );

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
});
