import {
  createRangeConstraint,
  hasBigintRangeConstraint,
  type RangeConstraintSpec,
} from "../constraint/range.js";
import {
  Declaration,
  Options as DeclarationOptions,
  Value,
  defaultFromOptions,
  type ExactOptions,
} from "../declaration.js";
import { registerVariable } from "../environment.js";
import { normalize } from "../error.js";
import { type Example } from "../example.js";
import { resolve } from "../maybe.js";
import { ScalarSchema, createScalar, toString } from "../schema.js";
import { SpecError } from "../variable.js";

export type Options = DeclarationOptions<bigint> &
  Partial<RangeConstraintSpec<bigint>>;

export function bigInteger<O extends Options>(
  name: string,
  description: string,
  options: ExactOptions<O, Options> = {} as ExactOptions<O, Options>,
): Declaration<bigint, O> {
  const { isSensitive = false } = options;
  const def = defaultFromOptions(options);
  const schema = createSchema(name, options);

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
      return resolve(v.nativeValue()) as Value<bigint, O>;
    },
  };
}

function createSchema(name: string, options: Options): ScalarSchema<bigint> {
  function unmarshal(v: string): bigint {
    try {
      return BigInt(v);
    } catch {
      throw new Error("must be a big integer");
    }
  }

  const constraints = [];

  try {
    if (hasBigintRangeConstraint(options)) {
      constraints.push(createRangeConstraint(options));
    }
  } catch (error) {
    throw new SpecError(name, normalize(error));
  }

  return createScalar("big integer", toString, unmarshal, constraints);
}

function buildExamples(): Example[] {
  return [
    {
      value: "123456",
      description: "positive",
    },
    {
      value: "-123456",
      description: "negative",
    },
    {
      value: "0x1E240",
      description: "hexadecimal",
    },
    {
      value: "0o361100",
      description: "octal",
    },
    {
      value: "0b11110001001000000",
      description: "binary",
    },
  ];
}
