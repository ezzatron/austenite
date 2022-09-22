import { initialize, string } from "../../src";

describe("String variables", () => {
  let env: typeof process.env;

  beforeEach(() => {
    env = process.env;
  });

  afterEach(() => {
    process.env = env;
  });

  it.each`
    name                    | value
    ${"AUSTENITE_STRING_A"} | ${"value-a"}
    ${"AUSTENITE_STRING_B"} | ${"value-b"}
  `(
    "should support string variables ($name)",
    ({ name, value }: { name: string; value: string }) => {
      const variable = string(name, "description-a");

      process.env[name] = value;
      initialize();

      expect(variable.value()).toBe(value);
    }
  );
});
