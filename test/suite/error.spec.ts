import { describe, expect, it } from "vitest";
import { normalize } from "../../src/error.js";

describe("Error functions", () => {
  describe("normalize()", () => {
    it("does nothing to Error instances", () => {
      const error = new Error("foo");

      expect(normalize(error)).toBe(error);
    });

    it("wraps strings in Error instances", () => {
      const error = "foo";
      const actual = normalize(error);

      expect(actual).toBeInstanceOf(Error);
      expect(actual.message).toBe("foo");
    });

    it("wraps other values in Error instances", () => {
      const error = { toString: () => "foo" };
      const actual = normalize(error);

      expect(actual).toBeInstanceOf(Error);
      expect(actual.message).toBe("foo");
    });
  });
});
