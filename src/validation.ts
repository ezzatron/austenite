import { normalize } from "./error.js";
import { Maybe } from "./maybe.js";
import { Value, Variable } from "./variable.js";

export function validate(variables: Variable<unknown>[]): [boolean, Results] {
  const results: Results = [];
  let isValid = true;

  for (const variable of variables) {
    try {
      results.push({
        variable,
        result: { maybe: variable.value() },
      });
    } catch (error) {
      isValid = false;
      results.push({ variable, result: { error: normalize(error) } });
    }
  }

  return [isValid, results];
}

export type Result = ErrorResult | ValueResult;
export type Results = VariableWithResult[];

export interface VariableWithResult {
  readonly variable: Variable<unknown>;
  readonly result: Result;
}

export interface ErrorResult {
  readonly error: Error;
  readonly maybe?: never;
}

export interface ValueResult {
  readonly error?: never;
  readonly maybe: Maybe<Value<unknown>>;
}
