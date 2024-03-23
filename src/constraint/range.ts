import { Temporal } from "@js-temporal/polyfill";
import {
  applyConstraints,
  type Constraint,
  type ExtrinsicConstraint,
} from "../constraint.js";
import { normalize } from "../error.js";

const { Duration } = Temporal;
type Duration = Temporal.Duration;

export type RangeConstraintSpec<T extends bigint | number | Duration> = {
  min?: T;
  minIsExclusive?: boolean;
  max?: T;
  maxIsExclusive?: boolean;
};

export function hasBigintRangeConstraint(options: {
  min?: bigint;
  max?: bigint;
}): options is RangeConstraintSpec<bigint> {
  return typeof options.min === "bigint" || typeof options.max === "bigint";
}

export function hasNumberRangeConstraint(options: {
  min?: number;
  max?: number;
}): options is RangeConstraintSpec<number> {
  return typeof options.min === "number" || typeof options.max === "number";
}

export function hasDurationRangeConstraint(options: {
  min?: Duration;
  max?: Duration;
}): options is RangeConstraintSpec<Duration> {
  return options.min instanceof Duration || options.max instanceof Duration;
}

export function createRangeConstraint<T extends bigint | number>(
  spec: RangeConstraintSpec<T>,
): ExtrinsicConstraint<T> {
  const {
    min = -Infinity,
    minIsExclusive = false,
    max = Infinity,
    maxIsExclusive = false,
  } = spec;

  if (min >= max) throw new Error(`minimum (${min}) is >= maximum (${max})`);

  const minOperator = minIsExclusive ? ">" : ">=";
  const maxOperator = maxIsExclusive ? "<" : "<=";
  let description: string;

  if (min === -Infinity) {
    description = `must be ${maxOperator} ${max}`;
  } else if (max === Infinity) {
    description = `must be ${minOperator} ${min}`;
  } else {
    description = `must be ${minOperator} ${min} and ${maxOperator} ${max}`;
  }

  return {
    description,
    constrain: function constrainRange(v) {
      const minSatisfied = minIsExclusive ? v > min : v >= min;
      const maxSatisfied = maxIsExclusive ? v < max : v <= max;

      return minSatisfied && maxSatisfied
        ? undefined
        : minSatisfied
          ? `must be ${maxOperator} ${max}`
          : `must be ${minOperator} ${min}`;
    },
  };
}

export function createDurationRangeConstraint(
  spec: RangeConstraintSpec<Duration>,
): ExtrinsicConstraint<Duration> {
  const { min, minIsExclusive = false, max, maxIsExclusive = false } = spec;

  if (min && max && Duration.compare(min, max) >= 0) {
    throw new Error(
      `minimum (${min.toString()}) is >= maximum (${max.toString()})`,
    );
  }

  const minOperator = minIsExclusive ? ">" : ">=";
  const maxOperator = maxIsExclusive ? "<" : "<=";
  let description: string;

  if (min && max) {
    description = `must be ${minOperator} ${min.toString()} and ${maxOperator} ${max.toString()}`;
  } else if (min) {
    description = `must be ${minOperator} ${min.toString()}`;
  } else if (max) {
    description = `must be ${maxOperator} ${max.toString()}`;
  } else {
    throw new Error(
      "invariant violation: at least one of min or max must be defined",
    );
  }

  return {
    description,
    constrain: function constrainDurationRange(v) {
      const minCompare = min ? Duration.compare(v, min) : 1;
      const maxCompare = max ? Duration.compare(v, max) : -1;

      const minSatisfied = minIsExclusive ? minCompare > 0 : minCompare >= 0;
      const maxSatisfied = maxIsExclusive ? maxCompare < 0 : maxCompare <= 0;

      return minSatisfied && maxSatisfied
        ? undefined
        : minSatisfied
          ? `must be ${maxOperator} ${max!.toString()}`
          : `must be ${minOperator} ${min!.toString()}`;
    },
  };
}

export function assertRangeSpec<T extends number | bigint | Duration>(
  constraints: Constraint<T>[],
  { min, max }: RangeConstraintSpec<T>,
): void {
  if (typeof min !== "undefined") {
    try {
      applyConstraints(constraints, min);
    } catch (error) {
      throw new Error(
        `minimum (${min.toString()}) ${normalize(error).message}`,
      );
    }
  }

  if (typeof max !== "undefined") {
    try {
      applyConstraints(constraints, max);
    } catch (error) {
      throw new Error(
        `maximum (${max.toString()}) ${normalize(error).message}`,
      );
    }
  }
}
