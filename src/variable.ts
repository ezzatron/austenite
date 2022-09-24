export const READ = Symbol("READ");

export interface Variable<T, O extends Options<T>> {
  readonly name: string;
  readonly description: string;
  readonly schema: string;
  readonly value: () => Value<T, O>;
  readonly [READ]: (readEnv: ReadEnv) => T | undefined;
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

type ReadEnv = (name: string) => string;

type Value<T, O extends Options<unknown>> = O["required"] extends false
  ? T | undefined
  : T;
