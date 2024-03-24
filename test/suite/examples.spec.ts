import { describe, expect, it } from "vitest";
import { integer } from "../../src/index.js";

describe("Examples", () => {
  describe("when a declaration example violates an intrinsic constraint", () => {
    it("throws", () => {
      expect(() => {
        integer("AUSTENITE_VAR", "<description>", {
          examples: [
            {
              value: 1,
              label: "valid",
            },
            {
              value: 1.1,
              label: "invalid",
            },
          ],
        });
      }).toThrow(
        `specification for AUSTENITE_VAR is invalid: example "invalid": value must be an integer`,
      );
    });
  });

  describe("when a declaration example violates an extrinsic constraint", () => {
    it("throws", () => {
      expect(() => {
        integer("AUSTENITE_VAR", "<description>", {
          max: 1,
          examples: [
            {
              value: 1,
              label: "valid",
            },
            {
              value: 2,
              label: "invalid",
            },
          ],
        });
      }).toThrow(
        `specification for AUSTENITE_VAR is invalid: example "invalid": value must be <= 1`,
      );
    });
  });

  describe("when a declaration example specifies a marshalled value that does not unmarshal to the native value", () => {
    it("throws", () => {
      expect(() => {
        integer("AUSTENITE_VAR", "<description>", {
          examples: [
            {
              value: 1,
              as: "2",
              label: "invalid",
            },
          ],
        });
      }).toThrow(
        `specification for AUSTENITE_VAR is invalid: example "invalid": value can't be expressed as "2": value mismatch`,
      );
    });
  });

  describe("when a declaration example specifies a marshalled value that can't be unmarshalled", () => {
    it("throws", () => {
      expect(() => {
        integer("AUSTENITE_VAR", "<description>", {
          examples: [
            {
              value: 1,
              as: "a",
              label: "invalid",
            },
          ],
        });
      }).toThrow(
        `specification for AUSTENITE_VAR is invalid: example "invalid": value can't be expressed as "a": must be an integer`,
      );
    });
  });

  describe("when a constraint makes a generated example invalid", () => {
    it("throws", () => {
      expect(() => {
        integer("AUSTENITE_VAR", "<description>", {
          min: 1,
        });
      }).toThrow(
        `specification for AUSTENITE_VAR is invalid: examples must be provided`,
      );
    });
  });

  describe("when a constraint can be applied to all generated examples", () => {
    it("does not throw", () => {
      expect(() => {
        integer("AUSTENITE_VAR", "<description>", {
          min: Number.MIN_SAFE_INTEGER,
        });
      }).not.toThrow();
    });
  });

  describe("when all declaration examples pass all constraints", () => {
    it("does not throw", () => {
      expect(() => {
        integer("AUSTENITE_VAR", "<description>", {
          min: 1,
          examples: [
            {
              value: 1,
              label: "valid A",
            },
            {
              value: 2,
              label: "valid B",
            },
          ],
        });
      }).not.toThrow();
    });
  });

  describe("when a declaration has no examples", () => {
    it("throws", () => {
      expect(() => {
        integer("AUSTENITE_VAR", "<description>", {
          examples: [],
        });
      }).toThrow(
        `specification for AUSTENITE_VAR is invalid: examples must be provided`,
      );
    });
  });
});
