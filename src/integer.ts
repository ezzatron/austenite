import {
  Declaration,
  defaultFromOptions,
  Options as DeclarationOptions,
  Value,
} from "./declaration";
import { registerVariable } from "./environment";
import { create as createExamples, Example, Examples } from "./example";
import { Maybe, resolve } from "./maybe";
import { createScalar, Scalar, toString } from "./schema";

type Constructor = NumberConstructor | BigIntConstructor;
type TypeFromConstructor<T extends Constructor> = T extends BigIntConstructor
  ? bigint
  : number;

export type Options<T> = DeclarationOptions<T>;

export function bigInteger<O extends Options<bigint>>(
  name: string,
  description: string,
  options: O = {} as O
): Declaration<bigint, O> {
  return create(BigInt, name, description, options);
}

export function integer<O extends Options<number>>(
  name: string,
  description: string,
  options: O = {} as O
): Declaration<number, O> {
  return create(Number, name, description, options);
}

function create<
  T extends Constructor,
  O extends Options<TypeFromConstructor<T>>
>(
  type: T,
  name: string,
  description: string,
  options: O
): Declaration<TypeFromConstructor<T>, O> {
  const def = defaultFromOptions(options);
  const schema = (
    type === BigInt ? createBigIntSchema() : createNumberSchema()
  ) as Scalar<TypeFromConstructor<T>>;

  const v = registerVariable({
    name,
    description,
    default: def,
    schema,
    examples: buildExamples(type, schema, def),
  });

  return {
    value() {
      return resolve(v.nativeValue()) as Value<TypeFromConstructor<T>, O>;
    },
  };
}

function createBigIntSchema(): Scalar<bigint> {
  function unmarshal(v: string): bigint {
    try {
      return BigInt(v);
    } catch {
      throw new Error("must be a big integer");
    }
  }

  return createScalar("integer", toString, unmarshal);
}

function createNumberSchema(): Scalar<number> {
  function unmarshal(v: string): number {
    const n = Number(v);

    if (!Number.isInteger(n)) throw new Error("must be an integer");

    return n;
  }

  return createScalar("integer", toString, unmarshal);
}

function buildExamples<T>(
  type: Constructor,
  schema: Scalar<T>,
  def: Maybe<T | undefined>
): Examples {
  let defExample: Example | undefined;

  if (def.isDefined && typeof def.value !== "undefined") {
    defExample = {
      canonical: schema.marshal(def.value),
      description: "(default)",
    };
  }

  const exponentialExample =
    type === Number
      ? {
          canonical: "1.23456e+5",
          description: "exponential",
        }
      : undefined;

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
    exponentialExample,
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
