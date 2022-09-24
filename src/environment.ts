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
    let result: string, indicator: string;

    try {
      const value = variable[READ](readEnv);
      state.results[name] = { value };
      result = `✓ set to ${JSON.stringify(value)}`;
      indicator = "";
    } catch (e) {
      isValid = false;
      const error = e as Error;
      state.results[name] = { error };
      result = `✗ ${error.message}`;
      indicator = "❯";
    }

    table.addRow([indicator, name, description, schema, result]);
  }

  if (!isValid) {
    console.log("Environment Variables:");
    console.log("");
    console.log(table.render());
  }

  state.isInitialized = true;
}

export function reset(): void {
  state = createInitialState();
}

export function register<V extends AnyVariable>(v: V): V {
  if (state.isInitialized) throw new FinalizedError(v.name);

  state.variables[v.name] = v;

  return v;
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
