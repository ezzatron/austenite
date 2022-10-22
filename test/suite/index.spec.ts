import * as index from "../../src";
import { bigInteger } from "../../src/declaration/big-integer";
import { boolean } from "../../src/declaration/boolean";
import { duration } from "../../src/declaration/duration";
import { enumeration } from "../../src/declaration/enumeration";
import { integer } from "../../src/declaration/integer";
import { kubernetesAddress } from "../../src/declaration/kubernetes-address";
import { number } from "../../src/declaration/number";
import { string } from "../../src/declaration/string";
import { initialize, reset } from "../../src/environment";
import { createMockConsole } from "../helpers";

describe("Module index", () => {
  let exitCode: number | undefined;
  let env: typeof process.env;

  beforeEach(() => {
    exitCode = undefined;
    jest.spyOn(process, "exit").mockImplementation((code) => {
      exitCode = code ?? 0;

      return undefined as never;
    });

    env = process.env;
    process.env = {};

    createMockConsole();
  });

  afterEach(() => {
    process.env = env;
    reset();
  });

  it("exports the correct members", () => {
    expect(index as unknown).toEqual({
      bigInteger,
      boolean,
      duration,
      enumeration,
      initialize,
      integer,
      kubernetesAddress,
      number,
      string,
    });
  });

  it("uses the real process.exit function", () => {
    process.env.AUSTENITE_SPEC = "true";
    initialize();

    expect(exitCode).toBe(0);
  });
});
