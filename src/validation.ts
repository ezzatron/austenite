import { CompositeError, normalize } from "./error.js";
import { Maybe } from "./maybe.js";
import { Value, Variable, type VariableComposite } from "./variable.js";

export function validate(
  variables: Variable<unknown>[],
  composites: VariableComposite<unknown>[],
): [boolean, Results] {
  const resultMap = new Map<Variable<unknown>, Result>();
  let isValid = true;

  for (const variable of variables) {
    try {
      resultMap.set(variable, { maybe: variable.value() });
    } catch (error) {
      isValid = false;
      resultMap.set(variable, { error: normalize(error) });
    }
  }

  for (const composite of composites) {
    const shouldSkip = composite.variables.some(
      (variable) => resultMap.get(variable)?.error,
    );

    if (shouldSkip) continue;

    try {
      composite.value();
    } catch (error) {
      isValid = false;

      for (const variable of composite.variables) {
        resultMap.set(variable, {
          error: new CompositeError(variable.spec.name, normalize(error)),
        });
      }
    }
  }

  const results: Results = [];

  for (const variable of variables) {
    const result = resultMap.get(variable);
    if (result) results.push({ variable, result });
  }

  return [isValid, results];
}

export type Result = ErrorResult | ValueResult;
export type Results = VariableWithResult[];

export type VariableWithResult = {
  readonly variable: Variable<unknown>;
  readonly result: Result;
};

export type ErrorResult = {
  readonly error: Error;
  readonly maybe?: never;
};

export type ValueResult = {
  readonly error?: never;
  readonly maybe: Maybe<Value<unknown>>;
};
