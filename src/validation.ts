import { normalize } from "./error.js";
import { Maybe } from "./maybe.js";
import type { VariableComposite } from "./variable-composite.js";
import { Value, Variable } from "./variable.js";

export function validate(
  variables: Variable<unknown>[],
  composites: VariableComposite<unknown, Record<string, Variable<unknown>>>[],
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
    const hasPrerequisites = Object.values(composite.spec.variables).every(
      (variable) => {
        const result = resultMap.get(variable);

        return result && !result.error;
      },
    );

    if (!hasPrerequisites) continue;

    try {
      composite.value();
    } catch (error) {
      isValid = false;

      for (const variable of Object.values(composite.spec.variables)) {
        resultMap.set(variable, { error: normalize(error) });
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
