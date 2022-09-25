import { EOL } from "os";
import { createTable } from "./table";
import { UndefinedError } from "./validation";
import { AnyVariable, DEFAULT, READ, VariableValue } from "./variable";

let state: State = createInitialState();

export function initialize({
  onInvalid = defaultOnInvalid,
}: Options = {}): void {
  const names = Object.keys(state.variables).sort();
  const resultSet: ResultSet = [];
  let isValid = true;

  for (const name of names) {
    const variable = state.variables[name];
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

    state.results.set(variable, result);
    resultSet.push({ variable, result });
  }

  if (!isValid) {
    onInvalid({
      resultSet,
      defaultHandler() {
        defaultOnInvalid({ resultSet });
      },
    });
  }

  state.isInitialized = true;
}

export function reset(): void {
  state = createInitialState();
}

export function register<V extends AnyVariable>(variable: V): V {
  if (state.isInitialized) throw new FinalizedError(variable.name);

  state.variables[variable.name] = variable;

  return variable;
}

export function result<V extends AnyVariable>(variable: V): VariableValue<V> {
  if (!state.isInitialized) throw new UninitializedError(variable.name);

  const { error, value } = state.results.get(variable) ?? {};

  if (error != null) throw error;

  return value as VariableValue<V>;
}

export type ResultSet = VariableWithResult[];

function createInitialState(): State {
  return {
    isInitialized: false,
    variables: {},
    results: new Map(),
  };
}

function readEnv(name: string): string {
  return process.env[name] ?? "";
}

function defaultOnInvalid({ resultSet }: { resultSet: ResultSet }): never {
  const table = createTable();

  for (const { variable, result } of resultSet) {
    const {
      name,
      description,
      schema,
      hasDefault,
      default: defaultValue,
    } = variable;

    const { error, value, isDefault } = result;
    const nameCell = `${error != null ? "❯" : " "} ${name}`;
    const optionality = hasDefault ? "[]" : "  ";
    const schemaDefault = hasDefault
      ? ` = ${JSON.stringify(defaultValue)}`
      : "";
    const schemaCell = `${optionality[0]} ${schema} ${optionality[1]}${schemaDefault}`;
    const statusCell =
      error != null
        ? `✗ ${error.message}`
        : isDefault
        ? `✓ using default value`
        : `✓ set to ${JSON.stringify(value)}`;

    table.addRow([nameCell, description, schemaCell, statusCell]);
  }

  console.log(`Environment Variables:${EOL}${EOL}${table.render()}`);

  process.exit(1); // eslint-disable-line n/no-process-exit
}

class FinalizedError extends Error {
  constructor(name: string) {
    super(`${name} can not be defined after the environment is initialized.`);
  }
}

class UninitializedError extends Error {
  constructor(name: string) {
    super(`${name} can not be read until the environment is initialized.`);
  }
}

interface State {
  isInitialized: boolean;
  variables: Record<string, AnyVariable>;
  results: Map<AnyVariable, Result>;
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

type Result = ErrorResult | ValueResult;

interface VariableWithResult {
  variable: AnyVariable;
  result: Result;
}

interface Options {
  onInvalid?: OnInvalid;
}

interface OnInvalidArgs {
  resultSet: ResultSet;
  defaultHandler: () => never;
}

type OnInvalid = (args: OnInvalidArgs) => void;
