import { beforeEach, describe, expect, it } from "vitest";
import { Declaration } from "../../src/declaration.js";
import { Options } from "../../src/declaration/binary.js";
import { binary } from "../../src/index.js";
import { initialize } from "../../src/node.js";
import { noop } from "../helpers.js";

describe("Sensitive declarations", () => {
  describe("when the value is not valid", () => {
    let declaration: Declaration<Buffer, Options>;

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
