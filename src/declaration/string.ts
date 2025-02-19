import type {
  Constraint,
  DeclarationConstraintOptions,
} from "../constraint.js";
import {
  createLengthConstraint,
  type LengthConstraintSpec,
} from "../constraint/length.js";
import {
  DeclarationFromOptions,
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
import { createString, type ScalarSchema } from "../schema.js";

export type Options = DeclarationOptions<string> &
  DeclarationConstraintOptions<string> &
  DeclarationExampleOptions<string> & {
    readonly length?: LengthConstraintSpec;
  };

export function string<O extends Options>(
  name: string,
  description: string,
  options: ExactOptions<O, Options> = {} as ExactOptions<O, Options>,
): DeclarationFromOptions<string, O> {
  const { examples, isSensitive = false } = options;

  const def = defaultFromOptions(options);
  const schema = createSchema(name, options);

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

function createSchema(name: string, options: Options): ScalarSchema<string> {
  const { constraints: customConstraints = [], length } = options;
  const constraints: Constraint<string>[] = [];

  try {
    if (typeof length !== "undefined") {
      constraints.push(createLengthConstraint("length", length));
    }
  } catch (error) {
    throw new SpecError(name, normalize(error));
  }

  return createString("string", [...constraints, ...customConstraints]);
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
