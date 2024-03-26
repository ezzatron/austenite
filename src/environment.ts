import { EOL } from "os";
import { render as renderSpecification } from "./specification.js";
import { render as renderSummary } from "./summary.js";
import { Results, validate } from "./validation.js";
import {
  Variable,
  VariableSpec,
  create as createVariable,
  type VariableComposite,
} from "./variable.js";

let state: State = createInitialState();

export type InitializeOptions = {
  readonly onInvalid?: OnInvalid;
};

export function initialize(options: InitializeOptions = {}): void {
  if (process.env.AUSTENITE_SPEC === "true") {
    console.log(renderSpecification(variablesByName()));

    // eslint-disable-next-line n/no-process-exit
    process.exit(0);
  } else {
    const { onInvalid = defaultOnInvalid } = options;
    const [isValid, results] = validate(variablesByName(), state.composites);

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
  const variable = createVariable(spec);
  state.variables[variable.spec.name] = variable;

  return variable;
}

export function registerComposite<T>(
  composite: VariableComposite<T>,
): VariableComposite<T> {
  state.composites.push(composite);

  return composite;
}

export function readVariable<T>(spec: VariableSpec<T>): string {
  return process.env[spec.name] ?? "";
}

export function reset(): void {
  state = createInitialState();
}

type State = {
  // TODO: WTF TypeScript? Why can't I use unknown here?
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly variables: Record<string, Variable<any>>;
  readonly composites: VariableComposite<unknown>[];
};

function createInitialState(): State {
  return {
    variables: {},
    composites: [],
  };
}

function defaultOnInvalid({ results }: { results: Results }): never {
  console.error(
    ["Environment Variables:", "", renderSummary(results)].join(EOL),
  );

  // eslint-disable-next-line n/no-process-exit
  process.exit(1);

  return undefined as never;
}

function variablesByName(): Variable<unknown>[] {
  return Object.values(state.variables).sort(compareVariableNames);
}

function compareVariableNames(a: Variable<unknown>, b: Variable<unknown>) {
  return a.spec.name.localeCompare(b.spec.name);
}

export type OnInvalid = (args: OnInvalidArgs) => void;

type OnInvalidArgs = {
  readonly results: Results;
  readonly defaultHandler: () => never;
};
