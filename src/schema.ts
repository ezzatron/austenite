import { quote } from "./shell.js";

export type Schema<T> = {
  marshal(value: T): string;
  unmarshal(value: string): T;
  accept<U>(visitor: Visitor<U>): U;
};

export type MarshalFn<T> = Schema<T>["marshal"];
export type UnmarshalFn<T> = Schema<T>["unmarshal"];

export type ScalarSchema<T> = Schema<T> & {
  readonly description: string;
};

export type EnumSchema<T> = Schema<T> & {
  readonly members: Record<string, T>;
};

export type URLSchema = Schema<URL> & {
  readonly base: URL | undefined;
  readonly protocols: string[] | undefined;
};

export function createString(description: string): ScalarSchema<string> {
  return createScalar(description, identity, identity);
}

export function createEnum<T>(
  members: Record<string, T>,
  marshal: MarshalFn<T>,
  unmarshal: UnmarshalFn<T>,
): EnumSchema<T> {
  return {
    members,
    marshal,
    unmarshal,

    accept(visitor) {
      return visitor.visitEnum(this);
    },
  };
}

export function createURL(
  base: URL | undefined,
  protocols: string[] | undefined,
  marshal: MarshalFn<URL>,
  unmarshal: UnmarshalFn<URL>,
): URLSchema {
  return {
    base,
    protocols,
    marshal,
    unmarshal,

    accept(visitor) {
      return visitor.visitURL(this);
    },
  };
}

export function createScalar<T>(
  description: string,
  marshal: MarshalFn<T>,
  unmarshal: UnmarshalFn<T>,
): ScalarSchema<T> {
  return {
    description,
    marshal,
    unmarshal,

    accept(visitor) {
      return visitor.visitScalar(this);
    },
  };
}

export type Visitor<T> = {
  visitEnum(e: EnumSchema<unknown>): T;
  visitScalar(s: ScalarSchema<unknown>): T;
  visitURL(s: URLSchema): T;
};

export class InvalidEnumError<T> extends Error {
  constructor(members: Record<string, T>) {
    const quotedMembers = Object.keys(members).map(quote);
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

type Stringable = {
  toString(): string;
};

export function toString<T extends Stringable>(v: T): string {
  return v.toString();
}
