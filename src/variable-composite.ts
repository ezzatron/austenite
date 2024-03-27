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
    let isAllDefined = true;
    let isAllUndefined = true;

    for (const name in spec.variables) {
      const variable = spec.variables[name];
      const value = variable.nativeValue();

      if (value.isDefined) {
        values[name] = value.value;
        isAllUndefined = false;
      } else {
        isAllDefined = false;
      }
    }

    if (isAllUndefined) {
      resolution = { result: undefinedValue() };
    } else if (!isAllDefined) {
      resolution = { error: new Error("TODO") };
    } else {
      resolution = {
        result: definedValue(spec.resolve(values as ValueMap<VM>)),
      };
    }

    return resolution;
  }
}
