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

export type Options = DeclarationOptions<URL>;

export function url<O extends Options>(
  name: string,
  description: string,
  options: O = {} as O
): Declaration<URL, O> {
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
      return resolve(v.nativeValue()) as Value<URL, O>;
    },
  };
}

function createSchema(): Scalar<URL> {
  function unmarshal(v: string): URL {
    try {
      return new URL(v);
    } catch {
      throw new Error("must be a URL");
    }
  }

  return createScalar("URL", toString, unmarshal);
}

function buildExamples(
  schema: Scalar<URL>,
  def: Maybe<URL | undefined>
): Examples {
  let defExample: Example | undefined;

  if (def.isDefined && typeof def.value !== "undefined") {
    defExample = {
      canonical: schema.marshal(def.value),
      description: "(default)",
    };
  }

  return createExamples(defExample, {
    canonical: "https://host.example.org/path/to/resource",
    description: "URL",
  });
}
