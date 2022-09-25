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
      renderResult(result),
    ]);
  }

  return table.render();
}

function renderName({ name }: AnyVariable, { error }: Result) {
  return `${error != null ? "❯" : " "} ${name}`;
}

function renderSchema({
  schema,
  hasDefault,
  default: defaultValue,
}: AnyVariable) {
  const optionality = hasDefault ? "[]" : "  ";
  const schemaDefault = hasDefault ? ` = ${JSON.stringify(defaultValue)}` : "";

  return `${optionality[0]} ${schema} ${optionality[1]}${schemaDefault}`;
}

function renderResult({ error, value, isDefault }: Result) {
  return error != null
    ? `✗ ${error.message}`
    : isDefault
    ? `✓ using default value`
    : `✓ set to ${JSON.stringify(value)}`;
}
