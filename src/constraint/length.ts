import { Constraint } from "../constraint.js";

export type LengthConstraintSpec = number | { min?: number; max?: number };

export function createLengthConstraint<T extends { length: number }>(
  lengthType: string,
  spec: LengthConstraintSpec,
): Constraint<T> {
  let min: number, max: number;

  if (typeof spec === "number") {
    min = spec;
    max = spec;
  } else {
    min = spec.min ?? -Infinity;
    max = spec.max ?? Infinity;
  }

  if (min > max) {
    throw new Error(
      `minimum length (${min}) is greater than maximum length (${max})`,
    );
  }

  let description: string;

  if (min === max) {
    description = `must have a ${lengthType} of ${min}`;
  } else if (min === -Infinity) {
    description = `must have a maximum ${lengthType} of ${max}`;
  } else if (max === Infinity) {
    description = `must have a minimum ${lengthType} of ${min}`;
  } else {
    description = `must have a ${lengthType} between ${min} and ${max}`;
  }

  return {
    isExtrinsic: true,
    description,
    constrain: function constrainLength({ length }) {
      return length < min || length > max
        ? `${description}, but has a ${lengthType} of ${length}`
        : undefined;
    },
  };
}
