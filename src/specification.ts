import type { ListItem, PhrasingContent } from "mdast-util-from-markdown/lib";
import { toMarkdown } from "mdast-util-to-markdown";
import { Content } from "mdast-util-to-markdown/lib/types";
import { basename } from "path";
import { toContent, toContentArray } from "./markdown";
import { Visitor } from "./schema";
import { quote } from "./shell";
import { create as createTable } from "./table";
import { usage } from "./usage";
import { Variable } from "./variable";

export function render(variables: Variable<unknown>[]): string {
  const app = basename(process.argv[1]);

  return toMarkdown(
    {
      type: "root",
      children: [
        ...header(app, variables),
        ...index(variables),
        ...specification(variables),
        ...usage(app, variables),
      ],
    },
    {
      bullet: "-",
    }
  ).trim();
}

function header(app: string, variables: Variable<unknown>[]): Content[] {
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
      ? toContent<Content>(
          [
            "Please note that **undefined** variables and **empty strings** are considered",
            "equivalent.",
          ].join("\n")
        )
      : toContent<Content>(
          "**There do not appear to be any environment variables.**"
        ),
    ...toContentArray<Content>(
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
          ...toContentArray<PhrasingContent>(description),
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
          children: toContentArray<PhrasingContent>(description),
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
        return toContent(
          [
            "This variable **MUST** be set to one of the values below.",
            "If left undefined the application will print usage information to `STDERR` then",
            "exit with a non-zero exit code.",
          ].join("\n")
        );
      }

      if (typeof def.value === "undefined") {
        return toContent(
          "This variable **MAY** be set to one of the values below or left undefined."
        );
      }

      return toContent(
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
    table.addRow([`export ${name}=${quote(canonical)}`, `# ${description}`]);
  }

  return {
    type: "code",
    lang: "sh",
    value: table.render(),
  };
}
