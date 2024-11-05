import { enumeration } from "austenite";
import { initialize } from "austenite/node";
import { describe, expectTypeOf, it } from "vitest";
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

  describe("when the declaration is required", () => {
    describe(".value()", () => {
      it("returns a value that has a union type of all member types", async () => {
        const declaration = enumeration(
          "AUSTENITE_ENUMERATION",
          "<description>",
          members,
        );

        process.env.AUSTENITE_ENUMERATION = "<member-1>";
        await initialize({ onInvalid: noop });
        const actual = declaration.value();

        expectTypeOf(actual).toEqualTypeOf<0 | 1 | 2>();
      });
    });
  });

  describe("when the declaration is optional", () => {
    describe(".value()", () => {
      it("returns a value that has a union type of all member types plus undefined", async () => {
        const declaration = enumeration(
          "AUSTENITE_ENUMERATION",
          "<description>",
          members,
          {
            default: undefined,
          },
        );

        await initialize({ onInvalid: noop });
        const actual = declaration.value();

        expectTypeOf(actual).toEqualTypeOf<0 | 1 | 2 | undefined>();
      });
    });
  });

  describe("when valid options are specified", () => {
    it("does not allow unknown options", () => {
      const declaration = enumeration(
        "AUSTENITE_ENUMERATION",
        "<description>",
        members,
        // @ts-expect-error - unknown option
        {
          default: undefined,
          unknown: "unknown",
        },
      );

      expectTypeOf(declaration).toBeObject();
    });
  });
});
