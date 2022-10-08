import { fromMarkdown } from "mdast-util-from-markdown";
import type { ListItem } from "mdast-util-from-markdown/lib";
import { toMarkdown } from "mdast-util-to-markdown";
import { Content } from "mdast-util-to-markdown/lib/types";
import { basename } from "path";
import { quote } from "shell-quote";
import { Visitor } from "./schema";
import { AnyVariable, sortedVariableNames, Variables } from "./variable";

export function renderSpecification(variables: Variables): string {
  return toMarkdown(
    {
      type: "root",
      children: [...header(), ...index(variables), ...specification(variables)],
    },
    {
      bullet: "-",
    }
  ).trim();
}

function header(): Content[] {
  const app = basename(process.argv[1]);

  return [
    {
      type: "heading",
      depth: 1,
      children: [
        {
          type: "text",
          value: "Environment Variables",
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          type: "text",
          value: "This document describes the environment variables used by ",
        },
        {
          type: "inlineCode",
          value: app,
        },
        {
          type: "text",
          value: ".",
        },
      ],
    },
    ...markdownToContent(
      [
        "Please note that **undefined** variables and **empty strings** are considered",
        "equivalent.",
        "",
        "The application may consume other undocumented environment variables; this",
        "document only shows those variables defined using [Austenite].",
        "",
        "[austenite]: https://github.com/eloquent/austenite",
      ].join("\n")
    ),
  ];
}

function index(variables: Variables): Content[] {
  return [
    {
      type: "heading",
      depth: 2,
      children: [
        {
          type: "text",
          value: "Index",
        },
      ],
    },
    {
      type: "list",
      children: Object.values(variables).map((variable) =>
        indexEntry(variable)
      ),
    },
  ];
}

function indexEntry({ name, description }: AnyVariable): ListItem {
  return {
    type: "listItem",
    children: [
      {
        type: "paragraph",
        children: [
          {
            type: "link",
            url: `#${encodeURIComponent(name)}`,
            children: [
              {
                type: "inlineCode",
                value: name,
              },
            ],
          },
          {
            type: "text",
            value: ` — ${description}`,
          },
        ],
      },
    ],
  };
}

function specification(variables: Variables): Content[] {
  let content: Content[] = [];

  for (const name of sortedVariableNames(variables)) {
    content = [...content, ...variable(variables[name])];
  }

  return content;
}

function variable(variable: AnyVariable): Content[] {
  const { name, description } = variable;

  return [
    {
      type: "heading",
      depth: 2,
      children: [
        {
          type: "text",
          value: "Specification",
        },
      ],
    },
    {
      type: "heading",
      depth: 3,
      children: [
        {
          type: "inlineCode",
          value: name,
        },
      ],
    },
    {
      type: "blockquote",
      children: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              value: description,
            },
          ],
        },
      ],
    },
    variable.schema.accept(createSchemaRenderer(variable)),
    examples(variable),
  ];
}

function createSchemaRenderer({
  required,
  hasDefault,
}: AnyVariable): Visitor<Content> {
  return {
    visitSet() {
      if (required) {
        return markdownToContent(
          [
            "This variable **MUST** be set to one of the values below. If left undefined the",
            "application will print usage information to `STDERR` then exit with a non-zero",
            "exit code.",
          ].join("\n")
        )[0];
      }

      return markdownToContent(
        "This variable **MAY** be set to one of the values below or left undefined."
      )[0];
    },

    visitString() {
      if (hasDefault) {
        return markdownToContent(
          [
            "This variable **MAY** be set to a non-empty string. If left undefined the",
            "default value is used (see below).",
          ].join("\n")
        )[0];
      }

      if (required) {
        return markdownToContent(
          [
            "This variable **MUST** be set to a non-empty string. If left undefined the",
            "application will print usage information to `STDERR` then exit with a non-zero",
            "exit code.",
          ].join("\n")
        )[0];
      }

      return markdownToContent(
        "This variable **MAY** be set to a non-empty string or left undefined."
      )[0];
    },
  };
}

function examples({
  name,
  schema,
  hasDefault,
  default: defaultValue,
}: AnyVariable): Content {
  const lines = [];

  if (hasDefault) {
    lines.push(`export ${name}=${quote([String(defaultValue)])} # (default)`);
  } else {
    for (const { value, description } of schema.examples()) {
      if (description == null) {
        lines.push(`export ${name}=${value}`);
      } else {
        lines.push(`export ${name}=${value} # ${description}`);
      }
    }
  }

  return {
    type: "code",
    lang: "bash",
    value: lines.join("\n"),
  };
}

function markdownToContent(markdown: string): Content[] {
  return fromMarkdown(markdown).children;
}
