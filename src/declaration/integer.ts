import {
  Declaration,
  defaultFromOptions,
  Options as DeclarationOptions,
  Value,
} from "../declaration";
import { registerVariable } from "../environment";
import { create as createExamples, Example, Examples } from "../example";
import { Maybe, resolve } from "../maybe";
import { createScalar, Scalar, toString } from "../schema";

export type Options<T> = DeclarationOptions<T>;

export function integer<O extends Options<number>>(
  name: string,
  description: string,
  options: O = {} as O
): Declaration<number, O> {
  const def = defaultFromOptions(options);
  const schema = createSchema();

  const v = registerVariable({
    name,
    description,
    default: def,
    schema,
    examples: buildExamples(schema, def),
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

    if (!Number.isInteger(n)) throw new Error("must be an integer");

    return n;
  }

  return createScalar("integer", toString, unmarshal);
}

function buildExamples(
  schema: Scalar<number>,
  def: Maybe<number | undefined>
): Examples {
  let defExample: Example | undefined;

  if (def.isDefined && typeof def.value !== "undefined") {
    defExample = {
      canonical: schema.marshal(def.value),
      description: "(default)",
    };
  }

  return createExamples(
    defExample,
    {
      canonical: "123456",
      description: "positive",
    },
    {
      canonical: "-123456",
      description: "negative",
    },
    {
      canonical: "1.23456e+5",
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
    }
  );
}
