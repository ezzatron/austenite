import { normalize } from "./error.js";

export type Constraint<T> = {
  isExtrinsic: boolean;
  description: string;
  constrain: Constrain<T>;
};

export type Constrain<T> = (v: T) => string | undefined | void;

export function applyConstraints<T>(
  constraints: Constraint<T>[],
  value: T,
): void {
  const errors: Error[] = [];

  for (const { constrain } of constraints) {
    try {
      applyConstrain(constrain, value);
    } catch (error) {
      errors.push(normalize(error));
    }
  }

  if (errors.length > 0) throw new ConstraintsError(errors);
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

function applyConstrain<T>(constrain: Constrain<T>, value: T): void {
  const error = constrain(value);

  if (typeof error === "string") throw new Error(error);
}
