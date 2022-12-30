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

export function networkPortNumber<O extends Options<number>>(
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

  return createExamples(defExample, {
    canonical: "12345",
    description: "a port number",
  });
}
