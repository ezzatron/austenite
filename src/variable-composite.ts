import { applyConstraints, type Constraint } from "./constraint.js";
import { ValueError, normalize } from "./error.js";
import { createConjunctionFormatter } from "./list.js";
import {
  Maybe,
  definedValue,
  resolve as resolveMaybe,
  undefinedValue,
} from "./maybe.js";
import type { Value, ValueOfVariable, Variable } from "./variable.js";

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

    const setNames: string[] = [];
    const unsetNames: string[] = [];
    let isAllDefined = true;

    for (const variable of Object.values(spec.variables)) {
      if (variable.value().isDefined) {
        setNames.push(variable.spec.name);
      } else {
        isAllDefined = false;
        unsetNames.push(variable.spec.name);
      }
    }

    if (setNames.length < 1) {
      resolution = { result: undefinedValue() };

      return resolution;
    }

    if (!isAllDefined) {
      const blame = new Map<Variable<unknown>, Error>();

      for (const variable of Object.values(spec.variables)) {
        if (unsetNames.includes(variable.spec.name)) {
          blame.set(variable, new Error());
        }
      }

      resolution = {
        error: new PartialVariableCompositeError(setNames, unsetNames, blame),
      };

      return resolution;
    }

    const resolved = spec.resolve(
      Object.fromEntries(
        Object.entries(spec.variables).map(([name, variable]) => [
          name,
          resolveMaybe(variable.nativeValue()),
        ]),
      ) as ValueMap<VM>,
    );

    try {
      applyConstraints(spec.constraints, resolved);
    } catch (error) {
      const blame = new Map<Variable<unknown>, Error>();

      for (const [name, variable] of Object.entries(spec.variables)) {
        const { spec } = variable;
        const value = resolveMaybe(variable.value()) as Value<unknown>;

        blame.set(
          variable,
          new ValueError(
            name,
            spec.isSensitive,
            value.verbatim,
            normalize(error),
          ),
        );
      }

      resolution = {
        error: new VariableCompositeError(normalize(error).message, blame),
      };

      return resolution;
    }

    resolution = {
      result: definedValue(resolved),
    };

    return resolution;
  }
}

export class VariableCompositeError extends Error {
  constructor(
    message: string,
    public readonly blame: Map<Variable<unknown>, Error>,
  ) {
    super(message);
  }
}

export class PartialVariableCompositeError extends VariableCompositeError {
  constructor(
    public readonly setNames: string[],
    public readonly unsetNames: string[],
    public readonly blame: Map<Variable<unknown>, Error>,
  ) {
    const listFormatter = createConjunctionFormatter();
    const setList = listFormatter.format(setNames);
    const unsetList = listFormatter.format(unsetNames);

    super(
      `${setList} is set but ${unsetList} isn't, must set all or none`,
      blame,
    );
  }
}
