import { initialize, url } from "../../../src";
import { Declaration } from "../../../src/declaration";
import { Options } from "../../../src/declaration/url";
import { hasType, noop } from "../../helpers";

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
  let declaration: Declaration<URL, Options>;

  describe("when no options are supplied", () => {
    beforeEach(() => {
      declaration = url("AUSTENITE_URL", "<description>");

      initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow(
        "AUSTENITE_URL is undefined and does not have a default value"
      );
    });
  });

  describe("when empty options are supplied", () => {
    beforeEach(() => {
      declaration = url("AUSTENITE_URL", "<description>", {});

      initialize({ onInvalid: noop });
    });

    it("defaults to a required declaration", () => {
      expect(() => {
        declaration.value();
      }).toThrow(
        "AUSTENITE_URL is undefined and does not have a default value"
      );
    });
  });

  describe("when the declaration is required", () => {
    beforeEach(() => {
      declaration = url("AUSTENITE_URL", "<description>");
    });

    describe(".value()", () => {
      it("returns a URL value", () => {
        // this test is weird because it tests type inference
        const declaration = url("AUSTENITE_URL", "<description>");

        process.env.AUSTENITE_URL = "https://host.example.org/path/to/resource";
        initialize({ onInvalid: noop });
        const actual = declaration.value();

        expect(hasType<URL, typeof actual>(actual)).toBeNull();
      });
    });

    describe.each(validValueTable)(
      "when the value is valid (%s)",
      (_, url: string, expected: URL) => {
        beforeEach(() => {
          process.env.AUSTENITE_URL = url;

          initialize({ onInvalid: noop });
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
      }
    );

    describe.each(invalidValueTable)(
      "when the value is invalid (%s)",
      (_, url: string, expected: string) => {
        beforeEach(() => {
          process.env.AUSTENITE_URL = url;

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => {
              declaration.value();
            }).toThrow(expected);
          });
        });
      }
    );

    describe("when the value is empty", () => {
      beforeEach(() => {
        initialize({ onInvalid: noop });
      });

      describe(".value()", () => {
        it("throws", () => {
          expect(() => {
            declaration.value();
          }).toThrow(
            "AUSTENITE_URL is undefined and does not have a default value"
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

    describe(".value()", () => {
      it("returns an optional URL value", () => {
        // this test is weird because it tests type inference
        const declaration = url("AUSTENITE_URL", "<description>", {
          default: undefined,
        });

        initialize({ onInvalid: noop });
        const actual = declaration.value();

        expect(hasType<URL | undefined, typeof actual>(actual)).toBeNull();
      });
    });

    describe.each(validValueTable)(
      "when the value is valid (%s)",
      (_, url: string, expected: URL) => {
        beforeEach(() => {
          process.env.AUSTENITE_URL = url;

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the value", () => {
            expect(declaration.value()).toEqual(expected);
          });
        });
      }
    );

    describe.each(invalidValueTable)(
      "when the value is invalid (%s)",
      (_, url: string, expected: string) => {
        beforeEach(() => {
          process.env.AUSTENITE_URL = url;

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("throws", () => {
            expect(() => {
              declaration.value();
            }).toThrow(expected);
          });
        });
      }
    );

    describe("when the value is empty", () => {
      describe("when there is a default value", () => {
        beforeEach(() => {
          declaration = url("AUSTENITE_URL", "<description>", {
            default: new URL("https://default.example.org/path/to/resource"),
          });

          initialize({ onInvalid: noop });
        });

        describe(".value()", () => {
          it("returns the default", () => {
            expect(declaration.value()).toEqual(
              new URL("https://default.example.org/path/to/resource")
            );
          });
        });
      });

      describe("when there is no default value", () => {
        beforeEach(() => {
          declaration = url("AUSTENITE_URL", "<description>", {
            default: undefined,
          });

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
});
