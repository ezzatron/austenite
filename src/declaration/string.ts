import {
  createLengthConstraint,
  type LengthConstraintSpec,
} from "../constraint/length.js";
import {
  Declaration,
  Options as DeclarationOptions,
  Value,
  defaultFromOptions,
  type ExactOptions,
} from "../declaration.js";
import { registerVariable } from "../environment.js";
import { SpecError, normalize } from "../error.js";
import {
  resolveExamples,
  type DeclarationExampleOptions,
  type Example,
} from "../example.js";
import { resolve } from "../maybe.js";
import { createString } from "../schema.js";

export type Options = DeclarationOptions<string> &
  DeclarationExampleOptions<string> & {
    readonly length?: LengthConstraintSpec;
  };

export function string<O extends Options>(
  name: string,
  description: string,
  options: ExactOptions<O, Options> = {} as ExactOptions<O, Options>,
): Declaration<string, O> {
  const { examples, isSensitive = false, length } = options;

  const def = defaultFromOptions(options);
  const constraints = [];

  try {
    if (typeof length !== "undefined") {
      constraints.push(createLengthConstraint("length", length));
    }
  } catch (error) {
    throw new SpecError(name, normalize(error));
  }

  const schema = createString("string", constraints);

  const v = registerVariable({
    name,
    description,
    default: def,
    isSensitive,
    schema,
    examples: resolveExamples(name, schema, buildExamples, examples),
  });

  return {
    value() {
      return resolve(v.nativeValue()) as Value<string, O>;
    },
  };
}

function buildExamples(): Example<string>[] {
  return [
    {
      value: "conquistador",
      label: "any value",
    },
    {
      value: "alabaster parakeet",
      label: "some values may need escaping",
    },
  ];
}
