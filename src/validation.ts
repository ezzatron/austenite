import { normalizeError } from "./error";
import { Maybe } from "./maybe";
import { Value, Variable } from "./variable";

export function validate(variables: Variable<unknown>[]): [boolean, Results] {
  const results: Results = [];

  for (const variable of variables) {
    try {
      results.push({
        variable,
        result: { maybe: variable.value() },
      });
    } catch (error) {
      results.push({ variable, result: { error: normalizeError(error) } });
    }
  }

  return [false, results];
}

export type Result = ErrorResult | ValueResult;
export type Results = VariableWithResult[];

export interface VariableWithResult {
  variable: Variable<unknown>;
  result: Result;
}

export interface ErrorResult {
  error: Error;
  maybe?: never;
}

export interface ValueResult {
  error?: never;
  maybe: Maybe<Value<unknown>>;
}
