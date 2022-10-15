import { fromMarkdown } from "mdast-util-from-markdown";
import type { ListItem, PhrasingContent } from "mdast-util-from-markdown/lib";
import { toMarkdown } from "mdast-util-to-markdown";
import { Content } from "mdast-util-to-markdown/lib/types";
import { basename } from "path";
import { quote } from "shell-quote";
import { Visitor } from "./schema";
import { createTable } from "./table";
import { Variable } from "./variable";

export function renderSpecification(variables: Variable<unknown>[]): string {
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
    ...markdownToContentArray<Content>(
      [
        "Please note that **undefined** variables and **empty strings** are considered",
        "equivalent.",
        "",
        "The application may consume other undocumented environment variables; this",
        "document only shows those variables defined using [Austenite].",
        "",
        "[austenite]: https://github.com/env-iron/austenite",
      ].join("\n")
    ),
  ];
}

function index(variables: Variable<unknown>[]): Content[] {
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
      spread: false,
      children: variables.map((variable) => indexEntry(variable)),
    },
  ];
}

function indexEntry({
  spec: { name, description },
}: Variable<unknown>): ListItem {
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
            value: " — ",
          },
          ...markdownToContentArray<PhrasingContent>(description),
        ],
      },
    ],
  };
}

function specification(variables: Variable<unknown>[]): Content[] {
  let content: Content[] = [];
  for (const v of variables) content = [...content, ...variable(v)];

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

    ...content,
  ];
}

function variable(variable: Variable<unknown>): Content[] {
  const {
    spec: { name, description },
  } = variable;

  return [
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
          children: markdownToContentArray<PhrasingContent>(description),
        },
      ],
    },
    variable.spec.schema.accept(createSchemaRenderer(variable)),
    examples(variable),
  ];
}

function createSchemaRenderer({
  spec: { default: def },
}: Variable<unknown>): Visitor<Content> {
  return {
    visitEnum() {
      if (!def.isDefined) {
        return markdownToContent(
          [
            "This variable **MUST** be set to one of the values below.",
            "If left undefined the application will print usage information to `STDERR` then",
            "exit with a non-zero exit code.",
          ].join("\n")
        );
      }

      if (typeof def.value === "undefined") {
        return markdownToContent(
          "This variable **MAY** be set to one of the values below or left undefined."
        );
      }

      return markdownToContent(
        [
          "This variable **MAY** be set to one of the values below.",
          "If left undefined the default value is used (see below).",
        ].join("\n")
      );
    },

    visitScalar() {
      if (!def.isDefined) {
        return markdownToContent(
          [
            "This variable **MUST** be set to a non-empty string.",
            "If left undefined the application will print usage information to `STDERR` then",
            "exit with a non-zero exit code.",
          ].join("\n")
        );
      }

      if (typeof def.value === "undefined") {
        return markdownToContent(
          "This variable **MAY** be set to a non-empty string or left undefined."
        );
      }

      return markdownToContent(
        [
          "This variable **MAY** be set to a non-empty string.",
          "If left undefined the default value is used (see below).",
        ].join("\n")
      );
    },
  };
}

function examples({ spec: { name, examples } }: Variable<unknown>): Content {
  const table = createTable(1);

  for (const { canonical, description } of examples) {
    const comments = [];
    if (description != null) comments.push(description);

    const row = [`export ${name}=${quote([canonical])}`];
    if (comments.length > 0) row.push(`# ${comments.join(" ")}`);

    table.addRow(row);
  }

  return {
    type: "code",
    lang: "sh",
    value: table.render(),
  };
}

function markdownToContentArray<T>(markdown: string): T[] {
  return fromMarkdown(markdown).children as T[];
}

function markdownToContent<T>(markdown: string): T {
  const content = markdownToContentArray<T>(markdown);

  return content[0];
}
