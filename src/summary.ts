import { ValueError } from "./error.js";
import type { Maybe } from "./maybe.js";
import { Visitor } from "./schema.js";
import { quote } from "./shell.js";
import { create as createTable } from "./table.js";
import { Result, Results } from "./validation.js";
import { Variable, type Value } from "./variable.js";

const ATTENTION = "❯";
const INVALID = "✗";
const NEUTRAL = "•";
const VALID = "✓";

export function render(results: Results): string {
  const table = createTable(2);

  for (const { variable, result } of results) {
    table.addRow([
      renderName(variable, result),
      variable.spec.description,
      renderSchema(variable),
      renderResult(variable, result),
    ]);
  }

  return table.render();
}

function renderName({ spec: { name } }: Variable<unknown>, { error }: Result) {
  return `${error == null ? " " : ATTENTION} ${name}`;
}

function renderSchema({
  spec: { default: def, isSensitive, schema },
  marshal,
}: Variable<unknown>) {
  const rendered = schema.accept(createSchemaRenderer());

  const optionality = def.isDefined ? "[]" : "  ";
  const schemaDefault =
    def.isDefined && typeof def.value !== "undefined"
      ? ` = ${quoteAndSuppress(isSensitive, marshal(def.value))}`
      : "";

  return `${optionality[0]} ${rendered} ${optionality[1]}${schemaDefault}`;
}

function createSchemaRenderer(): Visitor<string> {
  return {
    visitEnum(e) {
      return Object.keys(e.members).join(" | ");
    },

    visitScalar(s) {
      return `<${s.description}>`;
    },

    visitURL() {
      return "<URL>";
    },
  };
}

function renderResult(
  { spec: { isSensitive } }: Variable<unknown>,
  result: Result,
) {
  const { error, maybe } = result;

  if (error != null) return `${INVALID} ${describeError(isSensitive, error)}`;

  const described = describeValue(isSensitive, maybe);
  const indicator = maybe.isDefined ? VALID : NEUTRAL;

  return `${indicator} ${described}`;
}

function describeError(isSensitive: boolean, error: Error) {
  if (error instanceof ValueError) {
    return (
      `set to ${quoteAndSuppress(isSensitive, error.value)}, ` +
      `${error.cause.message}`
    );
  }

  return "not set";
}

function describeValue(
  isSensitive: boolean,
  maybe: Maybe<Value<unknown>>,
): string {
  if (!maybe.isDefined) return "not set";
  if (maybe.value.isDefault) return "using default value";

  const { value } = maybe;
  const { canonical, verbatim } = value;
  const prefix = `set to ${quoteAndSuppress(isSensitive, canonical)}`;

  if (verbatim !== canonical) {
    if (isSensitive) return `${prefix} (specified non-canonically)`;

    const quotedVerbatim = quoteAndSuppress(isSensitive, verbatim);

    return `${prefix} (specified non-canonically as ${quotedVerbatim})`;
  }

  return prefix;
}

function quoteAndSuppress(isSensitive: boolean, value: string) {
  return isSensitive ? "<sensitive value>" : quote(value);
}
