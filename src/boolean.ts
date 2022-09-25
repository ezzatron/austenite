import { register, result } from "./environment";
import { ValidationError } from "./validation";
import { Options as CommonOptions, READ, Variable } from "./variable";

const defaultLiterals: Literals = {
  true: ["true"],
  false: ["false"],
};

export function boolean<O extends Options>(
  name: string,
  description: string,
  options: O | undefined = undefined
): Variable<boolean, O> {
  const definedOptions = options ?? ({} as O);
  const hasDefault = "default" in definedOptions;
  const {
    required = true,
    default: defaultValue,
    literals = defaultLiterals,
  } = definedOptions;

  const allLiterals = [...literals.true, ...literals.false];
  assertLiterals(name, allLiterals);
  const schema = allLiterals.join(" | ");
  const mapping = buildMapping(literals);

  const variable: Variable<boolean, O> = {
    name,
    description,
    schema,
    required,
    hasDefault,
    default: defaultValue,

    value() {
      return result(variable);
    },

    [READ](readEnv, DEFAULT) {
      const value = readEnv(name);

      if (value == "") return DEFAULT;

      const mapped = mapping[value];

      if (mapped != null) return mapped;

      throw new InvalidBooleanError(name, allLiterals, value);
    },
  };

  return register(variable);
}

function assertLiterals(name: string, literals: string[]) {
  const seen = new Set();

  for (const literal of literals) {
    if (literal.length < 1) throw new EmptyLiteralError(name);
    if (seen.has(literal)) throw new ReusedLiteralError(name, literal);

    seen.add(literal);
  }
}

function buildMapping(literals: Literals): Record<string, boolean | undefined> {
  const mapping: Record<string, boolean | undefined> = {};
  for (const literal of literals.true) mapping[literal] = true;
  for (const literal of literals.false) mapping[literal] = false;

  return mapping;
}

class EmptyLiteralError extends Error {
  constructor(name: string) {
    super(
      `The specification for ${name} is invalid: literals can not be an empty string.`
    );
  }
}

class ReusedLiteralError extends Error {
  constructor(name: string, literal: string) {
    const quotedLiteral = JSON.stringify(literal);

    super(
      `The specification for ${name} is invalid: literal ${quotedLiteral} can not be used multiple times.`
    );
  }
}

class InvalidBooleanError extends ValidationError {
  constructor(name: string, literals: string[], value: string) {
    const listFormatter = new Intl.ListFormat("en", {
      style: "short",
      type: "disjunction",
    });

    super(name, `set to ${value}, expected ${listFormatter.format(literals)}`);
  }
}

interface Options extends CommonOptions<boolean> {
  literals?: Literals;
}

interface Literals {
  true: string[];
  false: string[];
}
