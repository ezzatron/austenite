import { EOL } from "os";
import { createTable } from "./table";
import { AnyVariable, READ, VariableValue } from "./variable";

interface State {
  isInitialized: boolean;
  variables: Record<string, AnyVariable>;
  results: Record<string, Result>;
}

let state: State = createInitialState();

export function initialize(): void {
  const names = Object.keys(state.variables).sort();
  const table = createTable();
  let isValid = true;

  for (const name of names) {
    const variable = state.variables[name];
    const { description, schema } = variable;

    try {
      const value = variable[READ](readEnv);
      state.results[name] = { value };
      const quotedValue = JSON.stringify(value);

      table.addRow(["", name, description, schema, `✓ set to ${quotedValue}`]);
    } catch (e) {
      isValid = false;
      const error = e as Error;
      state.results[name] = { error };

      table.addRow(["❯", name, description, schema, `✗ ${error.message}`]);
    }
  }

  if (!isValid) {
    console.log(`Environment Variables:${EOL}${EOL}${table.render()}`);
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

function readEnv(name: string): string {
  return process.env[name] ?? "";
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

export function result<V extends AnyVariable>({ name }: V): VariableValue<V> {
  if (!state.isInitialized) throw new UninitializedError(name);

  const result = state.results[name];

  if (result.error != null) throw result.error;

  return result.value as VariableValue<V>;
}

function createInitialState(): State {
  return {
    isInitialized: false,
    variables: {},
    results: {},
  };
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
