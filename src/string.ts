import {
  Declaration,
  DeclarationOptions,
  defaultFromOptions,
  Value,
} from "./declaration";
import { registerVariable } from "./environment";
import { createExamples, Example, Examples } from "./example";
import { Maybe, resolveMaybe } from "./maybe";
import { createString, Scalar } from "./schema";

export type StringOptions = DeclarationOptions<string>;

export function string<O extends StringOptions>(
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
      return resolveMaybe(v.nativeValue()) as Value<string, O>;
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
