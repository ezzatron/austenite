import { basename } from "path";
import { code, inlineCode, strong } from "./markdown.js";
import { Visitor } from "./schema.js";
import { quote } from "./shell.js";
import { create as createTable } from "./table.js";
import { usage } from "./usage.js";
import { Variable } from "./variable.js";

export function render(variables: Variable<unknown>[]): string {
  const app = appName();
  const parts = [header(app, variables)];

  if (variables.length > 0) {
    parts.push(
      index(variables),
      specification(variables),
      usage(app, variables),
    );
  }

  return parts.join("\n\n");
}

function appName(): string {
  const envName = process.env.AUSTENITE_APP ?? "";

  return envName === "" ? basename(process.argv[1]) : envName;
}

function header(app: string, variables: Variable<unknown>[]): string {
  const middleParagraph =
    variables.length > 0
      ? `Please note that **undefined** variables and **empty strings** are considered
equivalent.`
      : `**There do not appear to be any environment variables.**`;

  return `# Environment Variables

This document describes the environment variables used by ${inlineCode(app)}.

${middleParagraph}

The application may consume other undocumented environment variables; this
document only shows those variables defined using [Austenite].

[austenite]: https://github.com/eloquent/austenite`;
}

function index(variables: Variable<unknown>[]): string {
  const items = variables.map(
    ({ spec: { name, description } }) =>
      `- [${inlineCode(name)}](#${name}) — ${description}`,
  );

  return `## Index

${items.join("\n")}`;
}

function specification(variables: Variable<unknown>[]): string {
  const parts = variables.map((v) => variable(v));

  return `## Specification

${parts.join("\n\n")}`;
}

function variable(variable: Variable<unknown>): string {
  const {
    spec: { name, description },
  } = variable;

  return `### ${inlineCode(name)}

> ${description}

${variable.spec.schema.accept(createSchemaRenderer(variable))}

${examples(variable)}`;
}

function createSchemaRenderer({
  spec: { default: def },
}: Variable<unknown>): Visitor<string> {
  return {
    visitEnum() {
      if (!def.isDefined) {
        return `This variable **MUST** be set to one of the values below.
If left undefined the application will print usage information to \`STDERR\` then
exit with a non-zero exit code.`;
      }

      if (typeof def.value === "undefined") {
        return `This variable **MAY** be set to one of the values below or left undefined.`;
      }

      return `This variable **MAY** be set to one of the values below.
If left undefined the default value is used (see below).`;
    },

    visitScalar({ description }): string {
      const beSetTo = `be set to a non-empty ${strong(description)}`;

      if (!def.isDefined) {
        return `This variable **MUST** ${beSetTo}.
If left undefined the application will print usage information to \`STDERR\` then
exit with a non-zero exit code.`;
      }

      if (typeof def.value === "undefined") {
        return `This variable **MAY** ${beSetTo} or left undefined.`;
      }

      return `This variable **MAY** ${beSetTo}.
If left undefined the default value is used (see below).`;
    },
  };
}

function examples({ spec: { name, examples } }: Variable<unknown>): string {
  const table = createTable(1);

  for (const { canonical, description } of examples) {
    table.addRow([`export ${name}=${quote(canonical)}`, `# ${description}`]);
  }

  return code("sh", table.render());
}
