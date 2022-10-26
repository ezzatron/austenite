import { inlineCode, strong } from "../../src/markdown.js";

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
});
