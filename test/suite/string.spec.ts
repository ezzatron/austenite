import { initialize, string } from "../../src";

describe("String variables", () => {
  let env: typeof process.env;

  beforeEach(() => {
    env = process.env;
  });

  afterEach(() => {
    process.env = env;
  });

  it("should support string variables", () => {
    const variable = string("AUSTENITE_STRING", "example string variable");

    process.env.AUSTENITE_STRING = "<value>";
    initialize();

    expect(variable.value()).toBe("<value>");
  });
});
