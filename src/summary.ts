import { Visitor } from "./schema.js";
import { quote } from "./shell.js";
import { create as createTable } from "./table.js";
import { Result, Results } from "./validation.js";
import { ValueError, Variable } from "./variable.js";

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
      renderResult(result),
    ]);
  }

  return table.render();
}

function renderName({ spec: { name } }: Variable<unknown>, { error }: Result) {
  return `${error == null ? " " : ATTENTION} ${name}`;
}

function renderSchema({
  spec: { default: def, schema },
  marshal,
}: Variable<unknown>) {
  const rendered = schema.accept(createSchemaRenderer());

  const optionality = def.isDefined ? "[]" : "  ";
  const schemaDefault =
    def.isDefined && typeof def.value !== "undefined"
      ? ` = ${quote(marshal(def.value))}`
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
  };
}

function renderResult({ error, maybe }: Result) {
  if (error != null) return `${INVALID} ${describeError(error)}`;
  if (!maybe.isDefined) return `${NEUTRAL} undefined`;
  if (maybe.value.isDefault) return `${VALID} using default value`;

  const { value } = maybe;
  const { canonical, verbatim } = value;
  const result = `${VALID} set to ${quote(canonical)}`;

  if (verbatim !== canonical) {
    return `${result} (specified non-canonically as ${quote(verbatim)})`;
  }

  return result;
}

function describeError(error: Error) {
  if (!(error instanceof ValueError)) return "undefined";

  return `set to ${quote(error.value)}, ${error.cause.message}`;
}
