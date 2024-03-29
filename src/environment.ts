import { EOL } from "os";
import {
  render as renderSpecification,
  type MarkdownPrettyPrintType,
} from "./specification.js";
import { render as renderSummary } from "./summary.js";
import { Results, validate } from "./validation.js";
import {
  createVariableComposite,
  type VariableComposite,
  type VariableCompositeSpec,
} from "./variable-composite.js";
import { Variable, VariableSpec, createVariable } from "./variable.js";

let state: State = createInitialState();

export type InitializeOptions = {
  readonly onInvalid?: OnInvalid;
  readonly markdownPrettyPrint?: MarkdownPrettyPrintType;
};

export async function initialize(
  options: InitializeOptions = {},
): Promise<void> {
  if (process.env.AUSTENITE_SPEC === "true") {
    const { markdownPrettyPrint = "prettier" } = options;
    console.log(
      await renderSpecification(markdownPrettyPrint, variablesByName()),
    );

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
  state.variables[variable.spec.name] = variable as Variable<unknown>;

  return variable;
}

export function registerVariableComposite<
  T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  VM extends Record<string, Variable<any>>,
>(spec: VariableCompositeSpec<T, VM>): VariableComposite<T, VM> {
  const composite = createVariableComposite(spec);
  state.composites.push(
    composite as VariableComposite<unknown, Record<string, Variable<unknown>>>,
  );

  return composite;
}

export function readVariable<T>(spec: VariableSpec<T>): string {
  return process.env[spec.name] ?? "";
}

export function reset(): void {
  state = createInitialState();
}

type State = {
  readonly variables: Record<string, Variable<unknown>>;
  readonly composites: VariableComposite<
    unknown,
    Record<string, Variable<unknown>>
  >[];
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
