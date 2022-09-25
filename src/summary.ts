import { createTable } from "./table";
import { Result, ResultSet } from "./validation";
import { AnyVariable } from "./variable";

export function renderSummary(resultSet: ResultSet): string {
  const table = createTable();

  for (const { variable, result } of resultSet) {
    table.addRow([
      renderName(variable, result),
      variable.description,
      renderSchema(variable),
      renderResult(variable, result),
    ]);
  }

  return table.render();
}

function renderName({ name }: AnyVariable, { error }: Result) {
  return `${error != null ? "❯" : " "} ${name}`;
}

function renderSchema({
  schema,
  required,
  hasDefault,
  default: defaultValue,
}: AnyVariable) {
  const optionality = !required || hasDefault ? "[]" : "  ";
  const schemaDefault = hasDefault ? ` = ${JSON.stringify(defaultValue)}` : "";

  return `${optionality[0]} ${schema} ${optionality[1]}${schemaDefault}`;
}

function renderResult(
  { hasDefault }: AnyVariable,
  { error, value, isDefault }: Result
) {
  if (error != null) return `✗ ${error.message}`;
  if (isDefault) return hasDefault ? "✓ using default value" : "• undefined";

  return `✓ set to ${JSON.stringify(value)}`;
}
