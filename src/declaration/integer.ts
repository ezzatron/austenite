import {
  createRangeConstraint,
  hasNumberRangeConstraint,
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

export type Options = DeclarationOptions<number> &
  Partial<RangeConstraintSpec<number>>;

export function integer<O extends Options>(
  name: string,
  description: string,
  options: ExactOptions<O, Options> = {} as ExactOptions<O, Options>,
): Declaration<number, O> {
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
      return resolve(v.nativeValue()) as Value<number, O>;
    },
  };
}

function createSchema(name: string, options: Options): ScalarSchema<number> {
  function unmarshal(v: string): number {
    const n = Number(v);

    if (!Number.isInteger(n)) throw new Error("must be an integer");

    return n;
  }

  const constraints = [];

  try {
    if (hasNumberRangeConstraint(options)) {
      if ("min" in options && !Number.isInteger(options.min)) {
        throw new Error(`minimum (${options.min}) must be an integer`);
      }
      if ("max" in options && !Number.isInteger(options.max)) {
        throw new Error(`maximum (${options.max}) must be an integer`);
      }

      constraints.push(createRangeConstraint(options));
    }
  } catch (error) {
    throw new SpecError(name, normalize(error));
  }

  return createScalar("integer", toString, unmarshal, constraints);
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
      value: "1.23456e+5",
      description: "exponential",
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
