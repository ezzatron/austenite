import { definedValue, Maybe, undefinedValue } from "./maybe.js";

export type Declaration<T, O extends Options<unknown>> = {
  readonly value: () => Value<T, O>;
};

export type Value<
  T,
  O extends Options<unknown>,
> = O["default"] extends undefined ? T | undefined : T;

export type Options<T> = {
  readonly default?: T;
  readonly isSensitive?: boolean;
};

export type ExactOptions<O, Expected> = O extends Expected
  ? Exclude<keyof O, keyof Expected> extends never
    ? O
    : never
  : never;

export function defaultFromOptions<T>(
  options: Options<T>,
): Maybe<T | undefined> {
  return "default" in options
    ? definedValue(options.default)
    : undefinedValue();
}
