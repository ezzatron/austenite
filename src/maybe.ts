export interface DefinedValue<T> {
  readonly isDefined: true;
  readonly value: T;
}

export interface UndefinedValue {
  readonly isDefined: false;
}

export type Maybe<T> = DefinedValue<T> | UndefinedValue;

export function definedValue<T>(value: T): DefinedValue<T> {
  return { isDefined: true, value };
}

export function undefinedValue(): UndefinedValue {
  return { isDefined: false };
}

export function mapMaybe<T, U>(
  maybe: Maybe<T>,
  map: (value: T) => U
): Maybe<U> {
  return maybe.isDefined ? definedValue(map(maybe.value)) : undefinedValue();
}

export function resolveMaybe<T>(maybe: Maybe<T>): T | undefined {
  return maybe.isDefined ? maybe.value : undefined;
}
