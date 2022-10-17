import {
  Declaration,
  defaultFromOptions,
  Options as DeclarationOptions,
  Value,
} from "./declaration";
import { registerVariable } from "./environment";
import { create as createExamples, Example, Examples } from "./example";
import { Maybe, resolve } from "./maybe";
import { createString, Scalar } from "./schema";

export type Options = DeclarationOptions<string>;

export function string<O extends Options>(
  name: string,
  description: string,
  options: O = {} as O
): Declaration<string, O> {
  const def = defaultFromOptions(options);
  const schema = createString("string");

  const v = registerVariable({
    name,
    description,
    default: def,
    schema,
    examples: buildExamples(schema, def),
  });

  return {
    value() {
      return resolve(v.nativeValue()) as Value<string, O>;
    },
  };
}

function buildExamples(
  schema: Scalar<string>,
  def: Maybe<string | undefined>
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
      canonical: "conquistador",
      description: "any value",
    },
    {
      canonical: "alabaster parakeet",
      description: "some values may need escaping",
    }
  );
}
