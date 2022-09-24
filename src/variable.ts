import { Options } from "./options";

export const READ = Symbol("READ");

export interface Variable<T, O extends Options<T>> {
  readonly name: string;
  readonly description: string;
  readonly schema: string;
  readonly value: () => O["required"] extends false ? T | undefined : T;
  readonly [READ]: (
    readEnv: (name: string) => string
  ) => O["required"] extends false ? T | undefined : T;
}

export type AnyVariable = Variable<unknown, Options<unknown>>;
