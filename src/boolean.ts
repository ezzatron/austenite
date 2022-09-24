import { read, register, result } from "./environment";
import { UndefinedError } from "./errors";
import { Options } from "./options";
import { READ, Variable } from "./variable";

interface BooleanOptions extends Options<boolean> {
  literals?: BooleanLiterals;
}

interface BooleanLiterals {
  true: string[];
  false: string[];
}

const defaultLiterals: BooleanLiterals = {
  true: ["true"],
  false: ["false"],
};

export function boolean<O extends BooleanOptions>(
  name: string,
  description: string,
  options: O | undefined = undefined
): Variable<boolean, O> {
  const {
    default: d,
    required = true,
    literals = defaultLiterals,
  } = options ?? {};

  assertLiterals(name, literals);
  const allLiterals = [...literals.true, ...literals.false];
  const schema = allLiterals
    .map((literal) => JSON.stringify(literal))
    .join(" | ");

  return register({
    name,
    description,
    schema,

    value() {
      return result(name);
    },

    [READ]() {
      const v = read(name);

      if (v != "") {
        if (literals.true.includes(v)) return true;
        if (literals.false.includes(v)) return false;
        throw new InvalidBooleanError(name, literals, v);
      }

      if (d != null) return d;
      if (required) throw new UndefinedError(name);

      return undefined;
    },
  } as Variable<boolean, O>);
}

function assertLiterals(name: string, literals: BooleanLiterals) {
  for (const literal of [...literals.true, ...literals.false]) {
    if (literal.length < 1) throw new EmptyLiteralError(name);
  }

  for (const literal of literals.true) {
    if (literals.false.includes(literal)) {
      throw new AmbiguousLiteralError(name, literal);
    }
  }
}

class EmptyLiteralError extends Error {
  constructor(name: string) {
    super(
      `The specification for ${name} is invalid: literals can not be an empty string.`
    );
  }
}

class AmbiguousLiteralError extends Error {
  constructor(name: string, literal: string) {
    const quotedLiteral = JSON.stringify(literal);

    super(
      `The specification for ${name} is invalid: literal ${quotedLiteral} can not be both true and false.`
    );
  }
}

class InvalidBooleanError extends Error {
  constructor(name: string, literals: BooleanLiterals, value: string) {
    const listFormatter = new Intl.ListFormat("en", {
      style: "short",
      type: "disjunction",
    });

    const quotedValue = JSON.stringify(value);
    const allLiterals = [...literals.true, ...literals.false];
    const expectedList = listFormatter.format(
      allLiterals.map((literal) => JSON.stringify(literal))
    );

    super(
      `The value of ${name} (${quotedValue}) is invalid: expected ${expectedList}.`
    );
  }
}
