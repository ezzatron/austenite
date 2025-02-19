import { binary } from "austenite";
import { initialize } from "austenite/node";
import { beforeEach, describe, expect, it } from "vitest";
import { DeclarationFromOptions } from "../../src/declaration.js";
import { Options } from "../../src/declaration/binary.js";
import { noop } from "../helpers.js";

describe("Sensitive declarations", () => {
  describe("when the value is not valid", () => {
    let declaration: DeclarationFromOptions<Buffer, Options>;

    beforeEach(async () => {
      declaration = binary("AUSTENITE_BINARY", "<description>", {
        isSensitive: true,
      });

      process.env.AUSTENITE_BINARY = "<value>";

      await initialize({ onInvalid: noop });
    });

    it("doesn't leak the value", () => {
      expect(() => {
        declaration.value();
      }).toThrow(
        "AUSTENITE_BINARY (<sensitive value>) is invalid: must be base64 encoded",
      );
    });
  });
});
