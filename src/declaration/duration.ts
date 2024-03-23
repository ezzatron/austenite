import { Temporal } from "@js-temporal/polyfill";
import {
  createDurationRangeConstraint,
  hasDurationRangeConstraint,
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

const { Duration } = Temporal;
type Duration = Temporal.Duration;

export type Options = DeclarationOptions<Duration> &
  Partial<RangeConstraintSpec<Duration>>;

export function duration<O extends Options>(
  name: string,
  description: string,
  options: ExactOptions<O, Options> = {} as ExactOptions<O, Options>,
): Declaration<Duration, O> {
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
      return resolve(v.nativeValue()) as Value<Duration, O>;
    },
  };
}

function createSchema(name: string, options: Options): ScalarSchema<Duration> {
  function unmarshal(v: string): Duration {
    try {
      return Duration.from(v);
    } catch {
      throw new Error("must be an ISO 8601 duration");
    }
  }

  const constraints = [];

  try {
    if (hasDurationRangeConstraint(options)) {
      constraints.push(createDurationRangeConstraint(options));
    }
  } catch (error) {
    throw new SpecError(name, normalize(error));
  }

  return createScalar("ISO 8601 duration", toString, unmarshal, constraints);
}

function buildExamples(): Example[] {
  return [
    {
      value: Duration.from({ minutes: 1, seconds: 30 }).toString(),
      description: "ISO 8601 duration",
    },
    {
      value: Duration.from({ months: 1, days: 15, hours: 12 }).toString(),
      description: "ISO 8601 duration",
    },
  ];
}
