import { describe, expect, it } from "vitest";
import { inlineCode, italic, strong, table } from "../../src/markdown.js";

describe("Markdown functions", () => {
  describe("inlineCode()", () => {
    it("escapes backtick characters", () => {
      expect(inlineCode("foo`bar")).toBe("`foo``bar`");
    });
  });

  describe("strong()", () => {
    it("escapes asterisk characters", () => {
      expect(strong("foo*bar")).toBe("**foo\\*bar**");
    });
  });

  describe("italic()", () => {
    it("escapes underscore characters", () => {
      expect(italic("foo_bar")).toBe("_foo\\_bar_");
    });
  });

  describe("table()", () => {
    it("renders a table", () => {
      const expected = [
        "| A   | B   | C   |",
        "| :-- | :-: | --: |",
        "| A1  | B1  | C1  |",
        "| A2  | B2  | C2  |",
      ].join("\n");

      expect(
        table(
          ["A", "B", "C"],
          ["left", "center", "right"],
          [
            ["A1", "B1", "C1"],
            ["A2", "B2", "C2"],
          ],
        ),
      ).toBe(expected);
    });
  });
});
