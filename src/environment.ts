import { EOL } from "os";
import { renderSpec } from "./spec";
import { renderSummary } from "./summary";
import { Result, ResultSet, validate } from "./validation";
import { AnyVariable, VariableValue } from "./variable";

let state: State = createInitialState();

export function initialize({
  onInvalid = defaultOnInvalid,
}: Options = {}): void {
  if (process.env.AUSTENITE_SPEC === "true") {
    console.log(renderSpec());

    // eslint-disable-next-line n/no-process-exit
    process.exit(0);
  } else {
    const [isValid, resultSet] = validate(state.variables);

    for (const { variable, result } of resultSet) {
      state.results.set(variable, result);
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

function createInitialState(): State {
  return {
    isInitialized: false,
    variables: {},
    results: new Map(),
  };
}

function defaultOnInvalid({ resultSet }: { resultSet: ResultSet }): never {
  console.log(`Environment Variables:${EOL}${EOL}${renderSummary(resultSet)}`);

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

interface Options {
  onInvalid?: OnInvalid;
}

interface OnInvalidArgs {
  resultSet: ResultSet;
  defaultHandler: () => never;
}

type OnInvalid = (args: OnInvalidArgs) => void;
