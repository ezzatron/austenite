import { url } from "austenite";
import { initialize } from "austenite/node";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { MockConsole, createMockConsole } from "../helpers.js";

const fixturesPath = fileURLToPath(
  new URL("../fixture/usage", import.meta.url),
);

describe("Usage documentation (Prettier unavailable)", () => {
  let exitCode: number | undefined;
  let mockConsole: MockConsole;

  beforeEach(() => {
    exitCode = undefined;
    vi.spyOn(process, "exit").mockImplementation((code) => {
      exitCode = (code ?? 0) as number;

      return undefined as never;
    });

    process.env = {
      AUSTENITE_MODE: "usage/markdown",
    };

    mockConsole = createMockConsole();
  });

  describe("when Prettier is not installed", () => {
    beforeAll(() => {
      vi.doMock("prettier", async () => {
        throw new Error('Cannot find module "prettier"');
      });
    });

    afterAll(() => {
      vi.doUnmock("prettier");
    });

    it("doesn't pretty print the specification output", async () => {
      url("LOGO", "Main logo image", {
        base: new URL("https://base.example.org/path/to/resource"),
      });
      await initialize();

      await expect(
        "<BEGIN>\n" + mockConsole.readStdout() + "\n<END>\n",
      ).toMatchFileSnapshot(fixturePath("no-prettier/prettier-unavailable"));
      expect(exitCode).toBe(0);
    });
  });

  describe("when Prettier is installed but not configured", () => {
    beforeAll(() => {
      vi.doMock("prettier", async () => {
        const prettier = await vi.importActual("prettier");

        return {
          ...prettier,

          async resolveConfig() {
            return null;
          },
        };
      });
    });

    afterAll(() => {
      vi.doUnmock("prettier");
    });

    it("uses prose wrap at 80 columns", async () => {
      url("LOGO", "Main logo image", {
        base: new URL("https://base.example.org/path/to/resource"),
      });
      await initialize();

      await expect(mockConsole.readStdout()).toMatchFileSnapshot(
        fixturePath("no-prettier/prettier-not-configured"),
      );
      expect(exitCode).toBe(0);
    });
  });

  describe("when pretty printing is explicitly disabled", () => {
    it("doesn't pretty print the specification output", async () => {
      url("LOGO", "Main logo image", {
        base: new URL("https://base.example.org/path/to/resource"),
      });
      await initialize({ markdownPrettyPrint: "none" });

      await expect(
        "<BEGIN>\n" + mockConsole.readStdout() + "\n<END>\n",
      ).toMatchFileSnapshot(fixturePath("no-prettier/prettier-disabled"));
      expect(exitCode).toBe(0);
    });
  });
});

function fixturePath(name: string): string {
  return join(fixturesPath, `${name}.md`);
}
