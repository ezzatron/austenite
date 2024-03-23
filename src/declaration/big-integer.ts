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
import { ScalarSchema, createScalar, toString } from "../schema.js";

export type Options = DeclarationOptions<bigint>;

export function bigInteger<O extends Options>(
  name: string,
  description: string,
  options: ExactOptions<O, Options> = {} as ExactOptions<O, Options>,
): Declaration<bigint, O> {
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
  });

  return {
    value() {
      return resolve(v.nativeValue()) as Value<bigint, O>;
    },
  };
}

function createSchema(): ScalarSchema<bigint> {
  function unmarshal(v: string): bigint {
    try {
      return BigInt(v);
    } catch {
      throw new Error("must be a big integer");
    }
  }

  return createScalar("big integer", toString, unmarshal, []);
}

function buildExamples(): Examples {
  return createExamples(
    {
      value: "123456",
      description: "positive",
    },
    {
      value: "-123456",
      description: "negative",
    },
    {
      value: "0x1E240",
      description: "hexadecimal",
    },
    {
      value: "0o361100",
      description: "octal",
    },
    {
      value: "0b11110001001000000",
      description: "binary",
    },
  );
}
