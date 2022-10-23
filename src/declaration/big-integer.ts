import {
  Declaration,
  defaultFromOptions,
  Options as DeclarationOptions,
  Value,
} from "../declaration.js";
import { registerVariable } from "../environment.js";
import { create as createExamples, Example, Examples } from "../example.js";
import { Maybe, resolve } from "../maybe.js";
import { createScalar, Scalar, toString } from "../schema.js";

export type Options<T> = DeclarationOptions<T>;

export function bigInteger<O extends Options<bigint>>(
  name: string,
  description: string,
  options: O = {} as O
): Declaration<bigint, O> {
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
      return resolve(v.nativeValue()) as Value<bigint, O>;
    },
  };
}

function createSchema(): Scalar<bigint> {
  function unmarshal(v: string): bigint {
    try {
      return BigInt(v);
    } catch {
      throw new Error("must be a big integer");
    }
  }

  return createScalar("integer", toString, unmarshal);
}

function buildExamples(
  schema: Scalar<bigint>,
  def: Maybe<bigint | undefined>
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
