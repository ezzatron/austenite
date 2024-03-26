import { normalize } from "./error.js";
import { Maybe } from "./maybe.js";
import {
  VariableCompositeError,
  type VariableComposite,
} from "./variable-composite.js";
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
    try {
      composite.value();
    } catch (compositeError) {
      isValid = false;

      if (compositeError instanceof VariableCompositeError) {
        for (const [variable, error] of compositeError.blame.entries()) {
          resultMap.set(variable, { error });
        }
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
