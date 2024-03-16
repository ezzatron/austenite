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
import { createString } from "../schema.js";

export type Options = DeclarationOptions<string>;

export function string<O extends Options>(
  name: string,
  description: string,
  options: ExactOptions<O, Options> = {} as ExactOptions<O, Options>,
): Declaration<string, O> {
  const { isSensitive = false } = options;
  const def = defaultFromOptions(options);
  const schema = createString("string");

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
      return resolve(v.nativeValue()) as Value<string, O>;
    },
  };
}

function buildExamples(): Examples {
  return createExamples(
    {
      canonical: "conquistador",
      description: "any value",
    },
    {
      canonical: "alabaster parakeet",
      description: "some values may need escaping",
    },
  );
}
