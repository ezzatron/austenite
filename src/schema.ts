import { Example } from "./example";

export interface Visitor<T> {
  visitSet: (set: SetSchema) => T;
  visitString: (string: StringSchema) => T;
}

type VisitorReturnType<V extends Visitor<unknown>> = V extends Visitor<infer T>
  ? T
  : never;

export interface Schema {
  examples(): Example[];
  accept<V extends Visitor<unknown>>(visitor: V): VisitorReturnType<V>;
}

export interface SetSchema extends Schema {
  readonly literals: string[];
}

export function createSet(literals: string[]): SetSchema {
  return {
    literals,

    examples() {
      return literals.map((literal) => ({
        value: literal,
      }));
    },

    accept<V extends Visitor<unknown>>(visitor: V): VisitorReturnType<V> {
      return visitor.visitSet(this) as VisitorReturnType<V>;
    },
  };
}

export type StringSchema = Schema;

export function createString(): StringSchema {
  return {
    examples() {
      return [
        {
          value: "foo",
          description: "randomly generated example",
        },
      ];
    },

    accept<V extends Visitor<unknown>>(visitor: V): VisitorReturnType<V> {
      return visitor.visitString(this) as VisitorReturnType<V>;
    },
  };
}
