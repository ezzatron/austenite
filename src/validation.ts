import { AnyVariable } from "./variable";

export type Result = ErrorResult | ValueResult;
export type ResultSet = VariableWithResult[];

export class ValidationError extends Error {
  constructor(public readonly name: string, message: string) {
    super(message);
  }
}

export class UndefinedError extends ValidationError {
  constructor(name: string) {
    super(name, "undefined");
  }
}

interface ErrorResult {
  error: Error;
  value?: undefined;
  isDefault?: undefined;
}

interface ValueResult {
  error?: undefined;
  value: unknown;
  isDefault: boolean;
}

interface VariableWithResult {
  variable: AnyVariable;
  result: Result;
}
