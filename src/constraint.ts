import { normalize } from "./error.js";

export type Constraint<T> = (v: T) => string | undefined;
export type DescribedConstraint<T> = {
  description: string;
  constrain: Constraint<T>;
};

export function applyConstraints<T>(
  constraints: DescribedConstraint<T>[],
  value: T,
): void {
  const errors: Error[] = [];

  for (const { constrain } of constraints) {
    try {
      applyConstraint(constrain, value);
    } catch (error) {
      errors.push(normalize(error));
    }
  }

  if (errors.length > 0) throw new ConstraintsError(errors);
}

export type LengthConstraintSpec = number | { min?: number; max?: number };

export function createLengthConstraint<T extends { length: number }>(
  lengthType: string,
  spec: LengthConstraintSpec,
): DescribedConstraint<T> {
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
    description,
    constrain: function constrainLength({ length }) {
      return length < min || length > max
        ? `${description}, but has a ${lengthType} of ${length}`
        : undefined;
    },
  };
}

export class ConstraintsError extends Error {
  constructor(public readonly errors: Error[]) {
    if (errors.length === 1) {
      super(errors[0].message);
    } else {
      super(`violates ${errors.length} constraints`);
    }
  }
}

function applyConstraint<T>(constraint: Constraint<T>, value: T): void {
  const error = constraint(value);

  if (typeof error === "string") throw new Error(error);
}
