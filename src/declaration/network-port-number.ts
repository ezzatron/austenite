import { createNetworkPortNumberConstraint } from "../constraint/network-port-number.js";
import {
  assertRangeSpec,
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

export function networkPortNumber<O extends Options>(
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
    if (!/^\d*$/.test(v)) throw new Error("must be an unsigned integer");
    if (v !== "0" && v.startsWith("0")) {
      throw new Error("must not have leading zeros");
    }

    return Number(v);
  }

  const constraints = [createNetworkPortNumberConstraint()];

  try {
    if (hasNumberRangeConstraint(options)) {
      assertRangeSpec(constraints, options);
      constraints.push(createRangeConstraint(options));
    }
  } catch (error) {
    throw new SpecError(name, normalize(error));
  }

  return createScalar("port number", toString, unmarshal, constraints);
}

function buildExamples(): Example[] {
  return [
    {
      value: "12345",
      description: "a port number",
    },
  ];
}
