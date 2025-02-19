import type {
  Constraint,
  DeclarationConstraintOptions,
} from "../constraint.js";
import {
  createRangeConstraint,
  hasNumberRangeConstraint,
  type RangeConstraintSpec,
} from "../constraint/range.js";
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
import { ScalarSchema, createScalar, toString } from "../schema.js";

export type Options = DeclarationOptions<number> &
  DeclarationConstraintOptions<number> &
  DeclarationExampleOptions<number> &
  Partial<RangeConstraintSpec<number>>;

export function number<O extends Options>(
  name: string,
  description: string,
  options: ExactOptions<O, Options> = {} as ExactOptions<O, Options>,
): DeclarationFromOptions<number, O> {
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
      return resolve(v.nativeValue()) as Value<number, O>;
    },
  };
}

function createSchema(name: string, options: Options): ScalarSchema<number> {
  function unmarshal(v: string): number {
    const n = Number(v);

    if (Number.isNaN(n)) throw new Error("must be numeric");

    return n;
  }

  const { constraints: customConstraints = [] } = options;
  const constraints: Constraint<number>[] = [];

  try {
    if (hasNumberRangeConstraint(options)) {
      constraints.push(createRangeConstraint(options));
    }
  } catch (error) {
    throw new SpecError(name, normalize(error));
  }

  return createScalar("number", toString, unmarshal, [
    ...constraints,
    ...customConstraints,
  ]);
}

function buildExamples(): Example<number>[] {
  return [
    {
      value: 123456,
      label: "integer",
    },
    {
      value: 123.456,
      label: "positive",
    },
    {
      value: -123.456,
      label: "negative",
    },
    {
      value: 1.23456e2,
      as: "1.23456e+2",
      label: "exponential",
    },
    {
      value: 0x1e240,
      as: "0x1e240",
      label: "hexadecimal",
    },
    {
      value: 0o361100,
      as: "0o361100",
      label: "octal",
    },
    {
      value: 0b11110001001000000,
      as: "0b11110001001000000",
      label: "binary",
    },
  ];
}
