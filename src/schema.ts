export interface Schema<T> {
  marshal(value: T): string;
  unmarshal(value: string): T;
  accept<U>(visitor: Visitor<U>): U;
}

export type MarshalFn<T> = Schema<T>["marshal"];
export type UnmarshalFn<T> = Schema<T>["unmarshal"];

export type Scalar<T> = Schema<T>;

export interface Enum<T> extends Schema<T> {
  members: string[];
}

export function createString(): Scalar<string> {
  return createScalar(identity, identity);
}

export function createUnsignedInteger(): Scalar<number> {
  function unmarshal(v: string): number {
    if (!/^\d*$/.test(v)) throw new Error("must be an unsigned integer");
    if (v !== "0" && v.startsWith("0")) {
      throw new Error("must not have leading zeros");
    }

    return Number(v);
  }

  return createScalar(toString, unmarshal);
}

export function createEnum<T>(
  members: string[],
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
  marshal: MarshalFn<T>,
  unmarshal: UnmarshalFn<T>
): Scalar<T> {
  return {
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

export class InvalidEnumError extends Error {
  constructor(members: string[]) {
    const listFormatter = new Intl.ListFormat("en", {
      style: "short",
      type: "disjunction",
    });

    super(`expected ${listFormatter.format(members)}`);
  }
}

function identity<T>(v: T): T {
  return v;
}

function toString<T>(v: T): string {
  return String(v);
}
