import type { Constraint } from "./constraint.js";
import { createDisjunctionFormatter } from "./list.js";
import { quote } from "./shell.js";

export type Schema<T> = {
  readonly marshal: (value: T) => string;
  readonly unmarshal: (value: string) => T;
  readonly constraints: Constraint<T>[];
  readonly accept: <U>(visitor: Visitor<U>) => U;
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

export function createString(
  description: string,
  constraints: Constraint<string>[],
): ScalarSchema<string> {
  return createScalar(description, identity, identity, constraints);
}

export function createEnum<T>(
  members: Record<string, T>,
  marshal: MarshalFn<T>,
  unmarshal: UnmarshalFn<T>,
  constraints: Constraint<T>[],
): EnumSchema<T> {
  return {
    members,
    marshal,
    unmarshal,
    constraints,

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
  constraints: Constraint<URL>[],
): URLSchema {
  return {
    base,
    protocols,
    marshal,
    unmarshal,
    constraints,

    accept(visitor) {
      return visitor.visitURL(this);
    },
  };
}

export function createScalar<T>(
  description: string,
  marshal: MarshalFn<T>,
  unmarshal: UnmarshalFn<T>,
  constraints: Constraint<T>[],
): ScalarSchema<T> {
  return {
    description,
    marshal,
    unmarshal,
    constraints,

    accept(visitor) {
      return visitor.visitScalar(this);
    },
  };
}

export type Visitor<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly visitEnum: (e: EnumSchema<any>) => T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly visitScalar: (s: ScalarSchema<any>) => T;
  readonly visitURL: (s: URLSchema) => T;
};

export class InvalidEnumError<T> extends Error {
  constructor(members: Record<string, T>) {
    const listFormatter = createDisjunctionFormatter();
    const quotedMembers = Object.keys(members).map(quote);

    super(`expected ${listFormatter.format(quotedMembers)}`);
  }
}

type Stringable = {
  readonly toString: () => string;
};

export function toString<T extends Stringable>(v: T): string {
  return v.toString();
}

function identity<T>(v: T): T {
  return v;
}
