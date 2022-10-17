import {
  Declaration,
  defaultFromOptions,
  Options as DeclarationOptions,
  Value,
} from "./declaration";
import { registerVariable } from "./environment";
import { create as createExamples, Examples } from "./example";
import { Maybe, resolve } from "./maybe";
import { createEnum, Enum, InvalidEnumError } from "./schema";
import { SpecError } from "./variable";

export interface Options extends DeclarationOptions<boolean> {
  readonly literals?: Literals;
}

export interface Literals {
  readonly true: string[];
  readonly false: string[];
}

const defaultLiterals: Literals = {
  true: ["true"],
  false: ["false"],
};

export function boolean<O extends Options>(
  name: string,
  description: string,
  options: O = {} as O
): Declaration<boolean, O> {
  const literals = assertLiterals(name, options.literals);
  const def = defaultFromOptions(options);

  const v = registerVariable({
    name,
    description,
    default: def,
    schema: createSchema(literals),
    examples: buildExamples(literals, def),
  });

  return {
    value() {
      return resolve(v.nativeValue()) as Value<boolean, O>;
    },
  };
}

function assertLiterals(
  name: string,
  literals: Literals | undefined
): Literals {
  if (literals == null) return defaultLiterals;

  const seen = new Set();

  for (const literal of [...literals.true, ...literals.false]) {
    if (literal.length < 1) throw new EmptyLiteralError(name);
    if (seen.has(literal)) throw new ReusedLiteralError(name, literal);

    seen.add(literal);
  }

  return literals;
}

function createSchema(literals: Literals): Enum<boolean> {
  const members = [...literals.true, ...literals.false];
  const trueLiteral = literals.true[0];
  const falseLiteral = literals.false[0];

  const mapping: Record<string, boolean | undefined> = {};
  for (const literal of literals.true) mapping[literal] = true;
  for (const literal of literals.false) mapping[literal] = false;

  function marshal(v: boolean): string {
    return v ? trueLiteral : falseLiteral;
  }

  function unmarshal(v: string): boolean {
    const mapped = mapping[v];

    if (mapped != null) return mapped;

    throw new InvalidEnumError(members);
  }

  return createEnum(members, marshal, unmarshal);
}

function buildExamples(
  literals: Literals,
  def: Maybe<boolean | undefined>
): Examples {
  const defValue = def.isDefined ? def.value : undefined;

  return createExamples(
    ...literals.true.map((literal) => ({
      canonical: literal,
      description: defValue === true ? "true (default)" : "true",
    })),
    ...literals.false.map((literal) => ({
      canonical: literal,
      description: defValue === false ? "false (default)" : "false",
    }))
  );
}

class EmptyLiteralError extends SpecError {
  constructor(name: string) {
    super(name, new Error("literals can not be empty strings"));
  }
}

class ReusedLiteralError extends SpecError {
  constructor(name: string, literal: string) {
    super(
      name,
      new Error(
        `literal ${JSON.stringify(literal)} can not be used multiple times`
      )
    );
  }
}
