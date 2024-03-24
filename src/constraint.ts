import { normalize } from "./error.js";
import { createConjunctionFormatter } from "./list.js";

export type DeclarationConstraintOptions<T> = {
  readonly constraints?: ExtrinsicConstraint<T>[];
};

export type Constraint<T> = IntrinsicConstraint<T> | ExtrinsicConstraint<T>;

export type IntrinsicConstraint<T> = {
  readonly constrain: Constrain<T>;
};

export type ExtrinsicConstraint<T> = {
  readonly description: string;
  readonly constrain: Constrain<T>;
};

export type Constrain<T> = (v: T) => string | undefined | void | true;

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

export function extrinsicConstraints<T>(
  constraints: Constraint<T>[],
): ExtrinsicConstraint<T>[] {
  return constraints.filter(
    (c): c is ExtrinsicConstraint<T> => "description" in c,
  );
}

export class ConstraintsError extends Error {
  constructor(public readonly errors: Error[]) {
    const listFormatter = createConjunctionFormatter();

    super(listFormatter.format(errors.map((e) => e.message)));
  }
}

function applyConstrain<T>(constrain: Constrain<T>, value: T): void {
  const error = constrain(value);

  if (typeof error === "string") throw new Error(error);
}
