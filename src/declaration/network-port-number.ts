import {
  Declaration,
  Options as DeclarationOptions,
  Value,
  defaultFromOptions,
  type ExactOptions,
} from "../declaration.js";
import { registerVariable } from "../environment.js";
import { Examples, create as createExamples } from "../example.js";
import { resolve } from "../maybe.js";
import { Scalar, createScalar, toString } from "../schema.js";

export type Options = DeclarationOptions<number>;

export function networkPortNumber<O extends Options>(
  name: string,
  description: string,
  options: ExactOptions<O, Options> = {} as ExactOptions<O, Options>,
): Declaration<number, O> {
  const { isSensitive = false } = options;
  const def = defaultFromOptions(options);
  const schema = createSchema();

  const v = registerVariable({
    name,
    description,
    default: def,
    isSensitive,
    schema,
    examples: buildExamples(),
    constraint: validate,
  });

  return {
    value() {
      return resolve(v.nativeValue()) as Value<number, O>;
    },
  };
}

function createSchema(): Scalar<number> {
  function unmarshal(v: string): number {
    if (!/^\d*$/.test(v)) throw new Error("must be an unsigned integer");
    if (v !== "0" && v.startsWith("0")) {
      throw new Error("must not have leading zeros");
    }

    return Number(v);
  }

  return createScalar("port number", toString, unmarshal);
}

function validate(port: number): void {
  if (!Number.isInteger(port) || port < 0) {
    throw new Error("must be an unsigned integer");
  }
  if (port < 1 || port > 65535) throw new Error("must be between 1 and 65535");
}

function buildExamples(): Examples {
  return createExamples({
    canonical: "12345",
    description: "a port number",
  });
}
