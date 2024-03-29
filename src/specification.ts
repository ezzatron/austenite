import { basename } from "path";
import { extrinsicConstraints, type Constraint } from "./constraint.js";
import { createDisjunctionFormatter } from "./list.js";
import { code, inlineCode, italic, list, strong, table } from "./markdown.js";
import { Visitor } from "./schema.js";
import { quote } from "./shell.js";
import { Variable } from "./variable.js";

export function render(variables: Variable<unknown>[]): string {
  const app = appName();

  return variables.length < 1
    ? header(app, variables)
    : header(app, variables) + "\n\n" + specification(variables);
}

function appName(): string {
  const envName = process.env.AUSTENITE_APP ?? "";

  return envName === "" ? basename(process.argv[1]) : envName;
}

function header(app: string, variables: Variable<unknown>[]): string {
  const start = `# Environment variables

The ${inlineCode(app)} app uses **declarative environment variables** powered by
**[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite`;

  if (variables.length < 1) {
    return `${start}

> [!TIP]
> Try [declaring] some environment variables to see them listed here!

[declaring]: https://github.com/ezzatron/austenite#declarations`;
  }

  return `${start}

${index(variables)}

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if
> that variable isn't set.`;
}

function index(variables: Variable<unknown>[]): string {
  const rows = variables.map(
    ({ spec: { name, description, default: def } }) => [
      `[${inlineCode(name)}](#${name})`,
      def.isDefined ? "Optional" : "Required",
      uppercaseFirst(description),
    ],
  );

  return table(
    ["Name", "Usage", "Description"],
    ["left", "left", "left"],
    rows,
  );
}

function specification(variables: Variable<unknown>[]): string {
  return variables.map((v) => variable(v)).join("\n\n");
}

function variable(variable: Variable<unknown>): string {
  const {
    spec: { name, description },
  } = variable;

  const renderedSchema = variable.spec.schema.accept(
    createSchemaRenderer(variable),
  );
  const renderedDefaultExample = defaultExample(variable);
  const renderedExamples = examples(variable);

  return `## ${inlineCode(name)}

${italic(uppercaseFirst(description))}

${renderedSchema}${renderedDefaultExample}${renderedExamples}`;
}

function createSchemaRenderer(variable: Variable<unknown>): Visitor<string> {
  const {
    spec: { name, default: def },
  } = variable;

  const optionality = def.isDefined ? "an **optional**" : "a **required**";

  return {
    visitEnum({ members }) {
      const listFormatter = createDisjunctionFormatter();
      const acceptableValues = Object.keys(members).map((m) =>
        inlineCode(quote(m)),
      );

      return `The ${inlineCode(name)} variable is ${optionality} variable
that takes ${listFormatter.format(acceptableValues)}.`;
    },

    visitScalar({ description, constraints }): string {
      const constraintsDescription = constraintList(constraints);
      const end = constraintsDescription
        ? ` with these constraints:\n\n${constraintsDescription}`
        : ".";

      return `The ${inlineCode(name)} variable is ${optionality} variable
that takes ${strong(description)} values${end}`;
    },

    visitURL({ base, constraints }): string {
      const constraintsDescription = constraintList(constraints);
      const end = constraintsDescription
        ? ` with these constraints:\n\n${constraintsDescription}`
        : ".";

      const lines = [
        `The ${inlineCode(name)} variable is ${optionality} variable
that takes ${strong("URL")} values${end}`,
      ];

      if (base) {
        lines.push(
          `You can also use a URL reference relative to ` +
            `${inlineCode(quote(base.toString()))}.`,
        );
      }

      return lines.join("\n");
    },
  };
}

function constraintList<T>(constraints: Constraint<T>[]): string {
  return list(
    extrinsicConstraints(constraints).map(({ description }) =>
      uppercaseFirst(description),
    ),
  );
}

function defaultExample(variable: Variable<unknown>): string {
  const {
    spec: { name, default: def, isSensitive },
  } = variable;

  if (!def.isDefined || typeof def.value === "undefined") return "";

  const { value } = def;
  let body: string;

  if (isSensitive) {
    body = `> [!NOTE]
> The ${inlineCode(name)} variable is sensitive,
> so the default value can't be shown.`;
  } else {
    body = code(
      "sh",
      `export ${name}=${quote(variable.marshal(value))} # default`,
    );
  }

  return `

### Default value

${body}`;
}

function examples({
  spec: {
    name,
    examples,
    schema: { marshal },
  },
}: Variable<unknown>): string {
  const blocks = [];

  for (const example of examples) {
    const { as, label } = example;
    const value = as ?? marshal(example.value);

    blocks.push(code("sh", `export ${name}=${quote(value)} # ${label}`));
  }

  return `

### Example values

${blocks.join("\n\n")}`;
}

function uppercaseFirst(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
