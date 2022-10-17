import { quote } from "shell-quote";

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
    const quotedMembers = Object.keys(members).map((member) => quote([member]));
    const listFormatter = new Intl.ListFormat("en", {
      style: "short",
      type: "disjunction",
    });

    super(`expected ${listFormatter.format(quotedMembers)}`);
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
