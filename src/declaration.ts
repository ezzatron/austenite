import { definedValue, Maybe, undefinedValue } from "./maybe.js";

export interface Declaration<T, O extends Options<unknown>> {
  value(): Value<T, O>;
}

export type Value<
  T,
  O extends Options<unknown>,
> = O["default"] extends undefined ? T | undefined : T;

export interface Options<T> {
  readonly default?: T;
}

export function defaultFromOptions<T>(
  options: Options<T>,
): Maybe<T | undefined> {
  return "default" in options
    ? definedValue(options.default)
    : undefinedValue();
}
