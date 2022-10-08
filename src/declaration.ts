import { definedValue, Maybe, undefinedValue } from "./maybe";

export interface Declaration<T, O extends DeclarationOptions<unknown>> {
  value(): Value<T, O>;
}

export type Value<
  T,
  O extends DeclarationOptions<unknown>
> = O["default"] extends undefined ? T | undefined : T;

export interface DeclarationOptions<T> {
  readonly default?: T;
}

export function defaultFromOptions<T>(
  options: DeclarationOptions<T>
): Maybe<T | undefined> {
  return "default" in options
    ? definedValue(options.default)
    : undefinedValue();
}
