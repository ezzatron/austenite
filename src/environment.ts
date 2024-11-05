import {
  createVariableComposite,
  type VariableComposite,
  type VariableCompositeSpec,
} from "./variable-composite.js";
import { Variable, VariableSpec, createVariable } from "./variable.js";

export let state: State = createInitialState();

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

export function variablesByName(): Variable<unknown>[] {
  return Object.values(state.variables).sort(compareVariableNames);
}

function compareVariableNames(a: Variable<unknown>, b: Variable<unknown>) {
  return a.spec.name.localeCompare(b.spec.name);
}
