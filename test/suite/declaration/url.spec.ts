import { url } from "austenite";
import { initialize } from "austenite/node";
import { beforeEach, describe, expect, it } from "vitest";
import { DeclarationFromOptions } from "../../../src/declaration.js";
import { Options } from "../../../src/declaration/url.js";
import { noop } from "../../helpers.js";

const validValueTable = [
  [
    "typical URL",
    "https://host.example.org/path/to/resource",
    new URL("https://host.example.org/path/to/resource"),
  ],
] as const;

const invalidValueTable = [
  ["non-URL", "a", "value of AUSTENITE_URL (a) is invalid: must be a URL"],
  [
    "no protocol",
    "host.example.org",
    "value of AUSTENITE_URL (host.example.org) is invalid: must be a URL",
  ],
  [
    "contains whitespace",
    "https://host.example .org/path/to/resource",
    "value of AUSTENITE_URL ('https://host.example .org/path/to/resource') is invalid: must be a URL",
  ],
];

describe("URL declarations", () => {
  let declaration: DeclarationFromOptions<URL, Options>;

  describe("when no options are supplied", () => {
    beforeEach(async () => {
      declaration = url("AUSTENITE_URL", "<description>");

      await initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow("AUSTENITE_URL is not set and does not have a default value");
    });
  });

  describe("when empty options are supplied", () => {
    beforeEach(async () => {
      declaration = url("AUSTENITE_URL", "<description>", {});

      await initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow("AUSTENITE_URL is not set and does not have a default value");
    });
  });

  describe("when the declaration is required", () => {
    beforeEach(() => {
      declaration = url("AUSTENITE_URL", "<description>");
    });

    describe.each(validValueTable)(
      "when the value is valid (%s)",
      (_, url: string, expected: URL) => {
        beforeEach(async () => {
          process.env.AUSTENITE_URL = url;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value", () => {
            expect(declaration.value()).toEqual(expected);
          });

          it("returns the same value when called multiple times", () => {
            expect(declaration.value()).toEqual(expected);
            expect(declaration.value()).toEqual(expected);
          });
        });
      },
    );

    describe.each(invalidValueTable)(
      "when the value is invalid (%s)",
      (_, url: string, expected: string) => {
        beforeEach(async () => {
          process.env.AUSTENITE_URL = url;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => {
              declaration.value();
            }).toThrow(expected);
          });
        });
      },
    );

    describe("when the value is empty", () => {
      beforeEach(async () => {
        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "AUSTENITE_URL is not set and does not have a default value",
          );
        });
      });
    });
  });

  describe("when the declaration is optional", () => {
    beforeEach(() => {
      declaration = url("AUSTENITE_URL", "<description>", {
        default: undefined,
      });
    });

    describe.each(validValueTable)(
      "when the value is valid (%s)",
      (_, url: string, expected: URL) => {
        beforeEach(async () => {
          process.env.AUSTENITE_URL = url;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value", () => {
            expect(declaration.value()).toEqual(expected);
          });
        });
      },
    );

    describe.each(invalidValueTable)(
      "when the value is invalid (%s)",
      (_, url: string, expected: string) => {
        beforeEach(async () => {
          process.env.AUSTENITE_URL = url;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => {
              declaration.value();
            }).toThrow(expected);
          });
        });
      },
    );

    describe("when the value is empty", () => {
      describe("when there is a default value", () => {
        beforeEach(async () => {
          declaration = url("AUSTENITE_URL", "<description>", {
            default: new URL("https://default.example.org/path/to/resource"),
          });

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the default", () => {
            expect(declaration.value()).toEqual(
              new URL("https://default.example.org/path/to/resource"),
            );
          });
        });
      });

      describe("when there is no default value", () => {
        beforeEach(async () => {
          declaration = url("AUSTENITE_URL", "<description>", {
            default: undefined,
          });

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

  describe("when a base URL is specified", () => {
    beforeEach(() => {
      declaration = url("AUSTENITE_URL", "<description>", {
        base: new URL("https://base.example.org/path/to/base?x#y"),
      });
    });

    describe.each`
      description       | relative                 | expected
      ${"fragment"}     | ${"#a"}                  | ${"https://base.example.org/path/to/base?x#a"}
      ${"query"}        | ${"?a"}                  | ${"https://base.example.org/path/to/base?a"}
      ${"child path"}   | ${"a/b"}                 | ${"https://base.example.org/path/to/a/b"}
      ${"sibling path"} | ${"../a/b"}              | ${"https://base.example.org/path/a/b"}
      ${"root path"}    | ${"/a/b"}                | ${"https://base.example.org/a/b"}
      ${"schemeless"}   | ${"//other.example.org"} | ${"https://other.example.org/"}
    `(
      "when the value is a relative URL ($description)",
      ({ relative, expected }: { relative: string; expected: string }) => {
        beforeEach(async () => {
          process.env.AUSTENITE_URL = relative;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the resolved URL", () => {
            expect(declaration.value()).toEqual(new URL(expected));
          });
        });
      },
    );

    describe("when the value is an absolute URL", () => {
      beforeEach(async () => {
        process.env.AUSTENITE_URL = "wss://other.example.org/path/to/resource";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the specified URL", () => {
          expect(declaration.value()).toEqual(
            new URL("wss://other.example.org/path/to/resource"),
          );
        });
      });
    });
  });

  describe("when protocols are specified", () => {
    const protocols: string[] = ["ws:", "wss:"];

    beforeEach(() => {
      declaration = url("AUSTENITE_URL", "<description>", {
        protocols,
      });
    });

    describe.each`
      protocol  | url
      ${"ws:"}  | ${"ws://host.example.org/path/to/resource"}
      ${"wss:"} | ${"wss://host.example.org/path/to/resource"}
    `(
      "when the value matches one of the protocols ($protocol)",
      ({ url }: { url: string }) => {
        beforeEach(async () => {
          process.env.AUSTENITE_URL = url;

          await initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value", () => {
            expect(declaration.value()).toEqual(new URL(url));
          });
        });
      },
    );

    describe("when the value does not match any of the protocols", () => {
      beforeEach(async () => {
        process.env.AUSTENITE_URL = "https://host.example.org/path/to/resource";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_URL (https://host.example.org/path/to/resource) is invalid: protocol must be ws: or wss:, but is https:",
          );
        });
      });
    });

    describe("when the list of protocols is empty", () => {
      const protocols: string[] = [];

      it("throws", () => {
        expect(() => {
          url("AUSTENITE_URL", "<description>", {
            protocols,
          });
        }).toThrow(
          "specification for AUSTENITE_URL is invalid: list of protocols can not be empty",
        );
      });
    });

    describe.each`
      protocol   | expected
      ${""}      | ${'specification for AUSTENITE_URL is invalid: protocol (""): must end with a colon (:)'}
      ${"ws"}    | ${'specification for AUSTENITE_URL is invalid: protocol ("ws"): must end with a colon (:)'}
      ${"1a:"}   | ${'specification for AUSTENITE_URL is invalid: protocol ("1a:"): must be a valid protocol'}
      ${":"}     | ${'specification for AUSTENITE_URL is invalid: protocol (":"): must be a valid protocol'}
      ${":a:"}   | ${'specification for AUSTENITE_URL is invalid: protocol (":a:"): must be a valid protocol'}
      ${"a:a:"}  | ${'specification for AUSTENITE_URL is invalid: protocol ("a:a:"): must be a valid protocol'}
      ${":a:a:"} | ${'specification for AUSTENITE_URL is invalid: protocol (":a:a:"): must be a valid protocol'}
    `(
      "when a protocol is invalid ($protocol)",
      ({ protocol, expected }: { protocol: string; expected: string }) => {
        const protocols: string[] = [protocol];

        it("throws", () => {
          expect(() => {
            url("AUSTENITE_URL", "<description>", {
              protocols,
            });
          }).toThrow(expected);
        });
      },
    );

    describe("when using a default that does not match any of the protocols", () => {
      const def = new URL("https://host.example.org/path/to/resource");

      it("throws", () => {
        expect(() => {
          url("AUSTENITE_URL", "<description>", {
            protocols,
            default: def,
          });
        }).toThrow(
          "specification for AUSTENITE_URL is invalid: default value: protocol must be ws: or wss:, but is https:",
        );
      });
    });

    describe("when using a base URL that does not match any of the protocols", () => {
      const base = new URL("https://host.example.org/path/to/resource");

      it("throws", () => {
        expect(() => {
          url("AUSTENITE_URL", "<description>", {
            base,
            protocols,
          });
        }).toThrow(
          "specification for AUSTENITE_URL is invalid: base URL (https://host.example.org/path/to/resource): protocol must be ws: or wss:, but is https:",
        );
      });
    });
  });

  describe("when the declaration has constraints", () => {
    beforeEach(() => {
      declaration = url("AUSTENITE_URL", "<description>", {
        constraints: [
          {
            description: "<constraint A>",
            constrain: (v) =>
              v.hostname === "example.org" || "hostname must be example.org",
          },
          {
            description: "<constraint B>",
            constrain: (v) =>
              v.protocol === "https:" || "protocol must be https:",
          },
        ],
        examples: [
          { value: new URL("https://example.org/"), label: "example" },
        ],
      });
    });

    describe("when the value satisfies the constraints", () => {
      beforeEach(async () => {
        process.env.AUSTENITE_URL = "https://example.org/";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value()).toEqual(new URL("https://example.org/"));
        });
      });
    });

    describe("when the value violates the first constraint", () => {
      beforeEach(async () => {
        process.env.AUSTENITE_URL = "https://example.com/";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_URL (https://example.com/) is invalid: hostname must be example.org",
          );
        });
      });
    });

    describe("when the value violates the second constraint", () => {
      beforeEach(async () => {
        process.env.AUSTENITE_URL = "http://example.org/";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of AUSTENITE_URL (http://example.org/) is invalid: protocol must be https:",
          );
        });
      });
    });
  });

  describe("when the declaration has the constraints from the README", () => {
    beforeEach(() => {
      declaration = url("CDN_URL", "CDN to use when serving static assets", {
        constraints: [
          {
            description: "must not be a local URL",
            constrain: (v) =>
              !v.hostname.endsWith(".local") || "must not be a local URL",
          },
        ],
        examples: [
          {
            value: new URL("https://host.example.org/path/to/resource"),
            label: "absolute",
          },
        ],
      });
    });

    describe("when the value satisfies the constraints", () => {
      beforeEach(async () => {
        process.env.CDN_URL = "https://host.example.org/path/to/resource";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("returns the value", () => {
          expect(declaration.value()).toEqual(
            new URL("https://host.example.org/path/to/resource"),
          );
        });
      });
    });

    describe("when the value violates the constraints", () => {
      beforeEach(async () => {
        process.env.CDN_URL = "https://host.local/path/to/resource";

        await initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "value of CDN_URL (https://host.local/path/to/resource) is invalid: must not be a local URL",
          );
        });
      });
    });
  });
});
