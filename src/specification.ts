import { fromMarkdown } from "mdast-util-from-markdown";
import { toMarkdown } from "mdast-util-to-markdown";
import { Content } from "mdast-util-to-markdown/lib/types";

export function renderSpecification(): string {
  return toMarkdown(
    {
      type: "root",
      children: [...header(), ...index(), ...specification()],
    },
    {
      bullet: "-",
    }
  ).trim();
}

function header(): Content[] {
  const root = fromMarkdown(
    `# Environment Variables

This document describes the environment variables used by \`<app>\`.

Please note that **undefined** variables and **empty strings** are considered
equivalent.

The application may consume other undocumented environment variables; this
document only shows those variables defined using [Austenite].

[austenite]: https://github.com/eloquent/austenite`
  );

  return root.children;
}

function index(): Content[] {
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
      children: [
        {
          type: "listItem",
          children: [
            {
              type: "paragraph",
              children: [
                {
                  type: "link",
                  url: "#READ_DSN",
                  children: [
                    {
                      type: "inlineCode",
                      value: "READ_DSN",
                    },
                  ],
                },
                {
                  type: "text",
                  value: " — database connection string for read-models",
                },
              ],
            },
          ],
        },
      ],
    },
  ];
}

function specification(): Content[] {
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
          value: "READ_DSN",
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
              value: "database connection string for read-models",
            },
          ],
        },
      ],
    },
    required(),
    {
      type: "code",
      lang: "bash",
      value: "export READ_DSN=foo # randomly generated example",
    },
  ];
}

function required(): Content {
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
      {
        type: "text",
        value: [
          " be set to a non-empty string. If left undefined the",
          "application will print usage information to ",
        ].join("\n"),
      },
      {
        type: "inlineCode",
        value: "STDERR",
      },
      {
        type: "text",
        value: [" then exit with a non-zero", "exit code."].join("\n"),
      },
    ],
  };
}
