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

export function number<O extends Options>(
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
  });

  return {
    value() {
      return resolve(v.nativeValue()) as Value<number, O>;
    },
  };
}

function createSchema(): Scalar<number> {
  function unmarshal(v: string): number {
    const n = Number(v);

    if (Number.isNaN(n)) throw new Error("must be numeric");

    return n;
  }

  return createScalar("number", toString, unmarshal);
}

function buildExamples(): Examples {
  return createExamples(
    {
      canonical: "123456",
      description: "integer",
    },
    {
      canonical: "123.456",
      description: "positive",
    },
    {
      canonical: "-123.456",
      description: "negative",
    },
    {
      canonical: "1.23456e+2",
      description: "exponential",
    },
    {
      canonical: "0x1E240",
      description: "hexadecimal",
    },
    {
      canonical: "0o361100",
      description: "octal",
    },
    {
      canonical: "0b11110001001000000",
      description: "binary",
    },
  );
}
