import { applyConstraints, type Constraint } from "./constraint.js";
import { normalize } from "./error.js";
import { createConjunctionFormatter } from "./list.js";
import { Maybe, definedValue, undefinedValue } from "./maybe.js";
import type { ValueOfVariable, Variable } from "./variable.js";

export type ValueMap<VM extends Record<string, Variable<unknown>>> = {
  readonly [N in keyof VM]: ValueOfVariable<VM[N]>;
};

export type VariableCompositeSpec<
  T,
  VM extends Record<string, Variable<unknown>>,
> = {
  readonly variables: VM;
  readonly resolve: (values: ValueMap<VM>) => T;
  readonly constraints: Constraint<T>[];
};

export type VariableComposite<
  T,
  VM extends Record<string, Variable<unknown>>,
> = {
  readonly spec: VariableCompositeSpec<T, VM>;
  readonly value: () => Maybe<T>;
};

export function createVariableComposite<
  T,
  VM extends Record<string, Variable<unknown>>,
>(spec: VariableCompositeSpec<T, VM>): VariableComposite<T, VM> {
  let resolution: Resolution<T>;

  return {
    spec,
    value,
  };

  function value(): Maybe<T> {
    const { error, result } = resolve();

    if (error != null) throw error;
    return result;
  }

  type Resolution<T> =
    | {
        readonly result: Maybe<T>;
        readonly error?: never;
      }
    | {
        readonly result?: never;
        readonly error: Error;
      };

  function resolve(): Resolution<T> {
    // Stryker disable next-line ConditionalExpression: This is a performance optimization.
    if (resolution != null) return resolution;

    const values: Record<string, unknown> = {};
    const setVars: Variable<unknown>[] = [];
    const notSetVars: Variable<unknown>[] = [];
    let isAllDefined = true;

    for (const name in spec.variables) {
      const variable = spec.variables[name];
      const value = variable.nativeValue();

      if (value.isDefined) {
        values[name] = value.value;
        setVars.push(variable);
      } else {
        notSetVars.push(variable);
        isAllDefined = false;
      }
    }

    if (setVars.length < 1) {
      resolution = { result: undefinedValue() };

      return resolution;
    }

    if (!isAllDefined) {
      resolution = { error: new PartialCompositeError(setVars, notSetVars) };

      return resolution;
    }

    const resolved = spec.resolve(values as ValueMap<VM>);

    try {
      applyConstraints(spec.constraints, resolved);
    } catch (error) {
      resolution = {
        error: new CompositeError(normalize(error).message, setVars),
      };

      return resolution;
    }

    resolution = {
      result: definedValue(resolved),
    };

    return resolution;
  }
}

export class CompositeError extends Error {
  constructor(
    message: string,
    public readonly blame: Variable<unknown>[],
  ) {
    super(message);
  }
}

export class PartialCompositeError extends CompositeError {
  constructor(
    public readonly setVars: Variable<unknown>[],
    public readonly notSetVars: Variable<unknown>[],
  ) {
    const listFormatter = createConjunctionFormatter();

    const setNames = setVars.map((variable) => variable.spec.name);
    const setList = listFormatter.format(setNames);
    const setSuffix = setNames.length === 1 ? "is" : "are";

    const unsetNames = notSetVars.map((variable) => variable.spec.name);
    const unsetList = listFormatter.format(unsetNames);
    const unsetSuffix = unsetNames.length === 1 ? "isn't" : "aren't";

    super(
      `${setList} ${setSuffix} set but ${unsetList} ${unsetSuffix}, must set all or none`,
      notSetVars,
    );
  }
}
