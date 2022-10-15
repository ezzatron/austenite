import { EOL } from "os";
import { renderSpecification } from "./specification";
import { renderSummary } from "./summary";
import { Results, validate } from "./validation";
import { createVariable, Variable, VariableSpec } from "./variable";

let processExit = process.exit.bind(process);
let state: State = createInitialState();

export interface InitializeOptions {
  readonly onInvalid?: OnInvalid;
}

export function initialize(options: InitializeOptions = {}): void {
  if (process.env.AUSTENITE_SPEC === "true") {
    console.log(renderSpecification(variablesByName()));

    processExit(0);
  } else {
    state.isInitialized = true;

    const { onInvalid = defaultOnInvalid } = options;
    const [isValid, results] = validate(variablesByName());

    if (!isValid) {
      onInvalid({
        results,
        defaultHandler() {
          defaultOnInvalid({ results });
        },
      });
    }
  }
}

export function registerVariable<T>(spec: VariableSpec<T>): Variable<T> {
  if (state.isInitialized) throw new FinalizedError(spec.name);

  const variable = createVariable(spec);
  state.variables[variable.spec.name] = variable;

  return variable;
}

export function readVariable<T>(spec: VariableSpec<T>): string {
  if (!state.isInitialized) throw new UninitializedError(spec.name);

  return process.env[spec.name] ?? "";
}

export function setProcessExit(exit: typeof process.exit) {
  processExit = exit;
}

export function reset(): void {
  state = createInitialState();
}

interface State {
  // TODO: WTF TypeScript? Why can't I use unknown here?
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly variables: Record<string, Variable<any>>;
  isInitialized: boolean;
}

function createInitialState(): State {
  return {
    variables: {},
    isInitialized: false,
  };
}

function defaultOnInvalid({ results }: { results: Results }): never {
  console.error(
    ["Environment Variables:", "", renderSummary(results)].join(EOL)
  );

  processExit(1);

  return undefined as never;
}

function variablesByName(): Variable<unknown>[] {
  return Object.values(state.variables).sort(compareVariableNames);
}

function compareVariableNames(a: Variable<unknown>, b: Variable<unknown>) {
  return a.spec.name.localeCompare(b.spec.name);
}

type OnInvalid = (args: OnInvalidArgs) => void;

interface OnInvalidArgs {
  results: Results;
  defaultHandler: () => never;
}

class UninitializedError extends Error {
  constructor(name: string) {
    super(`${name} can not be read until the environment is initialized.`);
  }
}

class FinalizedError extends Error {
  constructor(name: string) {
    super(`${name} can not be defined after the environment is initialized.`);
  }
}
