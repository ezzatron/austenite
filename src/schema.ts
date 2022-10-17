export interface Schema<T> {
  marshal(value: T): string;
  unmarshal(value: string): T;
  accept<U>(visitor: Visitor<U>): U;
}

export type MarshalFn<T> = Schema<T>["marshal"];
export type UnmarshalFn<T> = Schema<T>["unmarshal"];

export interface Scalar<T> extends Schema<T> {
  readonly description: string;
}

export interface Enum<T> extends Schema<T> {
  members: Record<string, T>;
}

export function createString(description: string): Scalar<string> {
  return createScalar(description, identity, identity);
}

export function createUnsignedInteger(description: string): Scalar<number> {
  function unmarshal(v: string): number {
    if (!/^\d*$/.test(v)) throw new Error("must be an unsigned integer");
    if (v !== "0" && v.startsWith("0")) {
      throw new Error("must not have leading zeros");
    }

    return Number(v);
  }

  return createScalar(description, toString, unmarshal);
}

export function createEnum<T>(
  members: Record<string, T>,
  marshal: MarshalFn<T>,
  unmarshal: UnmarshalFn<T>
): Enum<T> {
  return {
    members,
    marshal,
    unmarshal,

    accept(visitor) {
      return visitor.visitEnum(this);
    },
  };
}

export function createScalar<T>(
  description: string,
  marshal: MarshalFn<T>,
  unmarshal: UnmarshalFn<T>
): Scalar<T> {
  return {
    description,
    marshal,
    unmarshal,

    accept(visitor) {
      return visitor.visitScalar(this);
    },
  };
}

export interface Visitor<T> {
  visitEnum(e: Enum<unknown>): T;
  visitScalar(s: Scalar<unknown>): T;
}

export class InvalidEnumError<T> extends Error {
  constructor(members: Record<string, T>) {
    const listFormatter = new Intl.ListFormat("en", {
      style: "short",
      type: "disjunction",
    });

    super(`expected ${listFormatter.format(Object.keys(members))}`);
  }
}

export function identity<T>(v: T): T {
  return v;
}

interface Stringable {
  toString(): string;
}

export function toString<T extends Stringable>(v: T): string {
  return v.toString();
}
