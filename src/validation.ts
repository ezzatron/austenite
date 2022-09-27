import { AnyVariable, DEFAULT, READ, sortedVariableNames } from "./variable";

export function validate(
  variables: Record<string, AnyVariable>
): [boolean, ResultSet] {
  const resultSet: ResultSet = [];
  let isValid = true;

  for (const name of sortedVariableNames(variables)) {
    const variable = variables[name];
    let result;

    try {
      const valueOrDefault = variable[READ](readEnv, DEFAULT);

      if (valueOrDefault === DEFAULT) {
        if (variable.required && !variable.hasDefault) {
          throw new UndefinedError(name);
        }

        result = { value: variable.default, isDefault: true };
      } else {
        result = { value: valueOrDefault, isDefault: false };
      }
    } catch (e) {
      isValid = false;
      const error = e as Error;
      result = { error };
    }

    resultSet.push({ variable, result });
  }

  return [isValid, resultSet];
}

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

function readEnv(name: string): string {
  return process.env[name] ?? "";
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
