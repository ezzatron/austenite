import {
  Declaration,
  Options as DeclarationOptions,
  Value,
  defaultFromOptions,
  type ExactOptions,
} from "../declaration.js";
import { registerVariable } from "../environment.js";
import { SpecError } from "../error.js";
import {
  resolveExamples,
  type DeclarationExampleOptions,
  type Example,
} from "../example.js";
import { resolve } from "../maybe.js";
import { EnumSchema, InvalidEnumError, createEnum } from "../schema.js";

export type Options = DeclarationOptions<boolean> &
  DeclarationExampleOptions<boolean> & {
    readonly literals?: Literals;
  };

export type Literals = Record<string, boolean>;

const defaultLiterals = {
  true: true,
  false: false,
};

export function boolean<O extends Options>(
  name: string,
  description: string,
  options: ExactOptions<O, Options> = {} as ExactOptions<O, Options>,
): Declaration<boolean, O> {
  const { examples, isSensitive = false, literals = defaultLiterals } = options;

  const schema = createSchema(name, literals);
  const def = defaultFromOptions(options);

  const v = registerVariable({
    name,
    description,
    default: def,
    isSensitive,
    schema,
    examples: resolveExamples(
      name,
      schema,
      () => buildExamples(literals),
      examples,
    ),
  });

  return {
    value() {
      return resolve(v.nativeValue()) as Value<boolean, O>;
    },
  };
}

function createSchema(name: string, literals: Literals): EnumSchema<boolean> {
  for (const literal of Object.keys(literals)) {
    if (literal.length < 1) throw new EmptyLiteralError(name);
  }

  const trueLiteral = findLiteral(name, literals, true);
  const falseLiteral = findLiteral(name, literals, false);

  function marshal(v: boolean): string {
    return v ? trueLiteral : falseLiteral;
  }

  function unmarshal(v: string): boolean {
    const mapped = literals[v];

    if (mapped != null) return mapped;

    throw new InvalidEnumError(literals);
  }

  return createEnum(literals, marshal, unmarshal, []);
}

function findLiteral(
  name: string,
  literals: Literals,
  native: boolean,
): string {
  for (const [literal, n] of Object.entries(literals)) {
    if (n === native) return literal;
  }

  throw new MissingLiteralError(name, native);
}

function buildExamples(literals: Literals): Example<boolean>[] {
  return Object.entries(literals).map(([literal, native]) => ({
    value: native,
    as: literal,
    label: String(native),
  }));
}

class EmptyLiteralError extends SpecError {
  constructor(name: string) {
    super(name, new Error("literals can not be empty strings"));
  }
}

class MissingLiteralError extends SpecError {
  constructor(name: string, native: boolean) {
    super(name, new Error(`a ${String(native)} literal must be defined`));
  }
}
