export interface Options<T> {
  required?: boolean;
  default?: T;
}

export type Value<T, O extends Options<unknown>> = O["required"] extends false
  ? T | undefined
  : T;

export const READ = Symbol("READ");

type ReadEnv = (name: string) => string;

export interface Variable<T, O extends Options<T>> {
  readonly name: string;
  readonly description: string;
  readonly schema: string;
  readonly value: () => Value<T, O>;
  readonly [READ]: (readEnv: ReadEnv) => Value<T, O>;
}

export type AnyVariable = Variable<unknown, Options<unknown>>;
