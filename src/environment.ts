import { EOL } from "os";
import { createTable, ReadOnlyTable } from "./table";
import { AnyVariable, READ, VariableValue } from "./variable";

interface State {
  isInitialized: boolean;
  variables: Record<string, AnyVariable>;
  results: Map<AnyVariable, Result>;
}

let state: State = createInitialState();

type OnInvalid = (
  table: ReadOnlyTable,
  defaultHandler: typeof defaultOnInvalid
) => void;

interface Options {
  onInvalid?: OnInvalid;
}

export function initialize({
  onInvalid = defaultOnInvalid,
}: Options = {}): void {
  const names = Object.keys(state.variables).sort();
  const table = createTable();
  let isValid = true;

  for (const name of names) {
    const variable = state.variables[name];
    const { description, schema } = variable;

    try {
      const value = variable[READ](readEnv);
      state.results.set(variable, { value });

      table.addRow([
        `  ${name}`,
        description,
        schema,
        `✓ set to ${JSON.stringify(value)}`,
      ]);
    } catch (e) {
      isValid = false;
      const error = e as Error;
      state.results.set(variable, { error });

      table.addRow([`❯ ${name}`, description, schema, `✗ ${error.message}`]);
    }
  }

  if (!isValid) onInvalid(table, defaultOnInvalid);

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

function defaultOnInvalid(table: ReadOnlyTable): never {
  console.log(`Environment Variables:${EOL}${EOL}${table.render()}`);

  process.exit(1); // eslint-disable-line n/no-process-exit
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

export function result<V extends AnyVariable>(variable: V): VariableValue<V> {
  if (!state.isInitialized) throw new UninitializedError(variable.name);

  const { error, value } = state.results.get(variable) ?? {};

  if (error != null) throw error;

  return value as VariableValue<V>;
}

function createInitialState(): State {
  return {
    isInitialized: false,
    variables: {},
    results: new Map(),
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
