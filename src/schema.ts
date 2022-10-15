export interface Schema<T> {
  readonly type: TypeNameOf<T>;
  marshal(value: T): string;
  unmarshal(value: string): T;
  accept<U>(visitor: Visitor<U>): U;
}

export type Scalar<T> = Schema<T>;

export interface Enum<T> extends Schema<T> {
  members: string[];
}

export interface BooleanLiterals {
  readonly true: string[];
  readonly false: string[];
}

export function createBoolean(literals: BooleanLiterals): Enum<boolean> {
  const members = [...literals.true, ...literals.false];
  const trueLiteral = literals.true[0];
  const falseLiteral = literals.false[0];

  const mapping: Record<string, boolean | undefined> = {};
  for (const literal of literals.true) mapping[literal] = true;
  for (const literal of literals.false) mapping[literal] = false;

  return {
    type: "boolean",
    members,

    marshal(v) {
      return v ? trueLiteral : falseLiteral;
    },

    unmarshal(v) {
      const mapped = mapping[v];

      if (mapped != null) return mapped;

      throw new InvalidEnumError(members);
    },

    accept(visitor) {
      return visitor.visitEnum(this);
    },
  };
}

export function createString(): Scalar<string> {
  return {
    type: "string",

    marshal(v) {
      return v;
    },

    unmarshal(v) {
      return v;
    },

    accept(visitor) {
      return visitor.visitScalar(this);
    },
  };
}

export function createUnsignedInteger(): Scalar<number> {
  return {
    type: "number",

    marshal(v) {
      return String(v);
    },

    unmarshal(v) {
      if (!/^\d*$/.test(v)) throw new Error("must be an unsigned integer");
      if (v !== "0" && v.startsWith("0")) {
        throw new Error("must not have leading zeros");
      }

      return Number(v);
    },

    accept(visitor) {
      return visitor.visitScalar(this);
    },
  };
}

export interface Visitor<T> {
  visitEnum(e: Enum<unknown>): T;
  visitScalar(s: Scalar<unknown>): T;
}

export type TypeNameOf<T> = T extends bigint
  ? "bigint"
  : T extends boolean
  ? "boolean"
  : // eslint-disable-next-line @typescript-eslint/ban-types
  T extends Function
  ? "function"
  : T extends string
  ? "string"
  : T extends symbol
  ? "symbol"
  : T extends number
  ? "number"
  : T extends undefined
  ? "undefined"
  : "object";

class InvalidEnumError extends Error {
  constructor(members: string[]) {
    const listFormatter = new Intl.ListFormat("en", {
      style: "short",
      type: "disjunction",
    });

    super(`expected ${listFormatter.format(members)}`);
  }
}
