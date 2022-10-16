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
      children: [
        ...header(variables),
        ...index(variables),
        ...specification(variables),
      ],
    },
    {
      bullet: "-",
    }
  ).trim();
}

function header(variables: Variable<unknown>[]): Content[] {
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
    variables.length > 0
      ? markdownToContent<Content>(
          [
            "Please note that **undefined** variables and **empty strings** are considered",
            "equivalent.",
          ].join("\n")
        )
      : markdownToContent<Content>(
          "**There do not appear to be any environment variables.**"
        ),
    ...markdownToContentArray<Content>(
      [
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
  if (variables.length < 1) return [];

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
  if (variables.length < 1) return [];

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

    visitScalar({ description }) {
      const beSetTo: PhrasingContent[] = [
        {
          type: "text",
          value: " be set to a non-empty ",
        },
        {
          type: "strong",
          children: [
            {
              type: "text",
              value: description,
            },
          ],
        },
      ];

      if (!def.isDefined) {
        return {
          type: "paragraph",
          children: [
            {
              type: "text",
              value: "This variable ",
            },
            {
              type: "strong",
              children: [
                {
                  type: "text",
                  value: "MUST",
                },
              ],
            },
            ...beSetTo,
            {
              type: "text",
              value: [
                ".",
                "If left undefined the application will print usage information to ",
              ].join("\n"),
            },
            {
              type: "inlineCode",
              value: "STDERR",
            },
            {
              type: "text",
              value: [" then", "exit with a non-zero exit code."].join("\n"),
            },
          ],
        };
      }

      if (typeof def.value === "undefined") {
        return {
          type: "paragraph",
          children: [
            {
              type: "text",
              value: "This variable ",
            },
            {
              type: "strong",
              children: [
                {
                  type: "text",
                  value: "MAY",
                },
              ],
            },
            ...beSetTo,
            {
              type: "text",
              value: " or left undefined.",
            },
          ],
        };
      }

      return {
        type: "paragraph",
        children: [
          {
            type: "text",
            value: "This variable ",
          },
          {
            type: "strong",
            children: [
              {
                type: "text",
                value: "MAY",
              },
            ],
          },
          ...beSetTo,
          {
            type: "text",
            value: [
              ".",
              "If left undefined the default value is used (see below).",
            ].join("\n"),
          },
        ],
      };
    },
  };
}

function examples({ spec: { name, examples } }: Variable<unknown>): Content {
  const table = createTable(1);

  for (const { canonical, description } of examples) {
    table.addRow([`export ${name}=${quote([canonical])}`, `# ${description}`]);
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
