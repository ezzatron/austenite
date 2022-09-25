import { EOL } from "os";
import { createTable } from "./table";
import { AnyVariable, READ, VariableValue } from "./variable";

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
      result = { value: variable[READ](readEnv) };
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
    const { name, description, schema } = variable;
    const { error, value } = result;
    const isError = error != null;
    const indicatorAndName = `${isError ? "❯" : " "} ${name}`;
    const status = isError
      ? `✗ ${error.message}`
      : `✓ set to ${JSON.stringify(value)}`;

    table.addRow([indicatorAndName, description, schema, status]);
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
}

interface ValueResult {
  error?: undefined;
  value: unknown;
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
