export const READ = Symbol("READ");
export const DEFAULT = Symbol("DEFAULT");

type DefaultSymbol = typeof DEFAULT;

export type Variables = Record<string, AnyVariable>;

export interface Variable<T, O extends Options<T>> {
  readonly name: string;
  readonly description: string;
  readonly schema: string;
  readonly required: boolean;
  readonly hasDefault: boolean;
  readonly default: T | undefined;
  readonly value: () => Value<T, O>;
  readonly [READ]: (readEnv: ReadEnv, D: DefaultSymbol) => T | DefaultSymbol;
}

export type AnyVariable = Variable<unknown, Options<unknown>>;

export type VariableValue<V extends AnyVariable> = V extends Variable<
  infer T,
  infer O
>
  ? Value<T, O>
  : never;

export interface Options<T> {
  required?: boolean;
  default?: T;
}

export function sortedVariableNames(variables: Variables) {
  return Object.keys(variables).sort();
}

type ReadEnv = (name: string) => string;

type Value<T, O extends Options<unknown>> = O["required"] extends false
  ? T | undefined
  : T;
