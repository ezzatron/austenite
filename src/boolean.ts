import { register, result } from "./environment";
import { UndefinedError, ValidationError } from "./validation";
import { Options as CommonOptions, READ, Variable } from "./variable";

interface Options extends CommonOptions<boolean> {
  literals?: Literals;
}

interface Literals {
  true: string[];
  false: string[];
}

const defaultLiterals: Literals = {
  true: ["true"],
  false: ["false"],
};

export function boolean<O extends Options>(
  name: string,
  description: string,
  options: O | undefined = undefined
): Variable<boolean, O> {
  const {
    default: defaultValue,
    required = true,
    literals = defaultLiterals,
  } = options ?? {};

  const allLiterals = [...literals.true, ...literals.false];
  assertLiterals(name, allLiterals);
  const schema = allLiterals.join(" | ");
  const mapping = buildMapping(literals);

  const variable: Variable<boolean, O> = {
    name,
    description,
    schema,

    value() {
      return result(variable);
    },

    [READ](readEnv) {
      const value = readEnv(name);

      if (value != "") {
        const mapped = mapping[value];

        if (mapped != null) return mapped;

        throw new InvalidBooleanError(name, allLiterals, value);
      }

      if (defaultValue != null) return defaultValue;
      if (required) throw new UndefinedError(name);

      return undefined;
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
