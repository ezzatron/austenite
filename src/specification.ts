import { fromMarkdown } from "mdast-util-from-markdown";
import { toMarkdown } from "mdast-util-to-markdown";
import { Content } from "mdast-util-to-markdown/lib/types";
import { basename } from "path";
import { quote } from "shell-quote";
import { AnyVariable, sortedVariableNames, Variables } from "./variable";

export function renderSpecification(variables: Variables): string {
  return toMarkdown(
    {
      type: "root",
      children: [...header(), ...index(), ...specification(variables)],
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

function specification(variables: Variables): Content[] {
  let content: Content[] = [];

  for (const name of sortedVariableNames(variables)) {
    content = [...content, ...variable(variables[name])];
  }

  return content;
}

function variable(variable: AnyVariable): Content[] {
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
    optionality(variable),
    example(variable),
  ];
}

function optionality({ required, hasDefault }: AnyVariable): Content {
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
}

function example({ hasDefault, default: defaultValue }: AnyVariable): Content {
  const value = hasDefault
    ? `${quote([String(defaultValue)])} # (default)`
    : "foo # randomly generated example";

  return {
    type: "code",
    lang: "bash",
    value: `export READ_DSN=${value}`,
  };
}

function markdownToContent(markdown: string): Content[] {
  return fromMarkdown(markdown).children;
}
