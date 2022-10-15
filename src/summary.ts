import { quote } from "shell-quote";
import { Visitor } from "./schema";
import { createTable } from "./table";
import { Result, Results } from "./validation";
import { UndefinedError, ValueError, Variable } from "./variable";

const ATTENTION = "❯";
const INVALID = "✗";
const NEUTRAL = "•";
const VALID = "✓";

export function renderSummary(results: Results): string {
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
      ? ` = ${quote([marshal(def.value)])}`
      : "";

  return `${optionality[0]} ${rendered} ${optionality[1]}${schemaDefault}`;
}

function createSchemaRenderer(): Visitor<string> {
  return {
    visitEnum(e) {
      return e.members.join(" | ");
    },

    visitScalar() {
      return "<string>";
    },
  };
}

function renderResult({ error, maybe }: Result) {
  if (error != null) return `${INVALID} ${describeError(error)}`;
  if (!maybe.isDefined) return `${NEUTRAL} undefined`;
  if (maybe.value.isDefault) return `${VALID} using default value`;

  return `${VALID} set to ${quote([maybe.value.verbatim])}`;
}

function describeError(error: Error) {
  if (error instanceof UndefinedError) return "undefined";

  if (error instanceof ValueError) {
    return `set to ${quote([error.value])}, ${error.cause.message}`;
  }

  return error.message;
}
