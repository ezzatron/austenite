import type { PhrasingContent, RootContent, TableRow } from "mdast";
import { fromMarkdown } from "mdast-util-from-markdown";
import { gfmToMarkdown } from "mdast-util-gfm";
import { toMarkdown } from "mdast-util-to-markdown";
import { basename, join } from "node:path";
import {
  extrinsicConstraints,
  type ExtrinsicConstraint,
} from "./constraint.js";
import type { Example } from "./example.js";
import { createDisjunctionFormatter } from "./list.js";
import { Visitor } from "./schema.js";
import { quote } from "./shell.js";
import { Variable } from "./variable.js";

export type MarkdownPrettyPrintType = "prettier" | "none";

export async function render(
  prettyPrintType: MarkdownPrettyPrintType,
  variables: Variable<unknown>[],
): Promise<string> {
  const app = appName();

  return prettyPrint(
    prettyPrintType,
    toMarkdown(
      {
        type: "root",
        children: [
          ...headerAST(app, variables),
          ...specificationAST(variables),
        ],
      },
      {
        bullet: "-",
        emphasis: "_",
        extensions: [gfmToMarkdown()],
      },
    ),
  );
}

async function prettyPrint(
  prettyPrintType: MarkdownPrettyPrintType,
  markdown: string,
): Promise<string> {
  if (prettyPrintType === "prettier") {
    try {
      const prettier = await import("prettier");

      const options = (await prettier.resolveConfig(
        join(process.cwd(), "ENVIRONMENT.md"),
      )) ?? {
        printWidth: 80,
        proseWrap: "always",
      };

      return (
        await prettier.format(markdown, { ...options, parser: "markdown" })
      ).trimEnd();
    } catch {
      // fall through
    }
  }

  return markdown.trimEnd();
}

function appName(): string {
  const envName = process.env.AUSTENITE_APP ?? "";

  return envName === "" ? basename(process.argv[1]) : envName;
}

function headerAST(app: string, variables: Variable<unknown>[]): RootContent[] {
  return [
    {
      type: "heading",
      depth: 1,
      children: [
        {
          type: "text",
          value: "Environment variables",
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          type: "text",
          value: "The ",
        },
        {
          type: "inlineCode",
          value: app,
        },
        {
          type: "text",
          value: " app uses ",
        },
        {
          type: "strong",
          children: [
            {
              type: "text",
              value: "declarative environment variables",
            },
          ],
        },
        {
          type: "text",
          value: " powered by ",
        },
        {
          type: "strong",
          children: [
            {
              type: "linkReference",
              identifier: "Austenite",
              referenceType: "shortcut",
              children: [
                {
                  type: "text",
                  value: "Austenite",
                },
              ],
            },
          ],
        },
        {
          type: "text",
          value: ".",
        },
      ],
    },
    {
      type: "definition",
      identifier: "austenite",
      url: "https://github.com/ezzatron/austenite",
    },

    ...(variables.length < 1 ? noVariablesAST() : indexAST(variables)),
  ];
}

function noVariablesAST(): RootContent[] {
  return [
    {
      type: "html",
      value: "<!-- prettier-ignore-start -->",
    },
    {
      type: "blockquote",
      children: [
        {
          type: "paragraph",
          children: [
            {
              type: "html",
              value: "[!TIP]\n",
            },
            {
              type: "text",
              value: "Try ",
            },
            {
              type: "linkReference",
              identifier: "declaring",
              referenceType: "shortcut",
              children: [
                {
                  type: "text",
                  value: "declaring",
                },
              ],
            },
            {
              type: "text",
              value: " some environment variables to see them listed here!",
            },
          ],
        },
      ],
    },
    {
      type: "html",
      value: "<!-- prettier-ignore-end -->",
    },
    {
      type: "definition",
      identifier: "declaring",
      url: "https://github.com/ezzatron/austenite#declarations",
    },
  ];
}

function indexAST(variables: Variable<unknown>[]): RootContent[] {
  return [
    {
      type: "table",
      align: ["left", "left", "left"],
      children: [
        {
          type: "tableRow",
          children: [
            { type: "tableCell", children: [{ type: "text", value: "Name" }] },
            { type: "tableCell", children: [{ type: "text", value: "Usage" }] },
            {
              type: "tableCell",
              children: [{ type: "text", value: "Description" }],
            },
          ],
        },

        ...variables.map(
          ({ spec: { name, description, default: def } }): TableRow => ({
            type: "tableRow",
            children: [
              {
                type: "tableCell",
                children: [
                  {
                    type: "link",
                    url: headingLink(name),
                    children: [{ type: "inlineCode", value: name }],
                  },
                ],
              },
              {
                type: "tableCell",
                children: [
                  {
                    type: "text",
                    value: def.isDefined ? "Optional" : "Required",
                  },
                ],
              },
              {
                type: "tableCell",
                children: userContent(uppercaseFirst(description)),
              },
            ],
          }),
        ),
      ],
    },
    {
      type: "html",
      value: "<!-- prettier-ignore-start -->",
    },
    {
      type: "blockquote",
      children: [
        {
          type: "paragraph",
          children: [
            {
              type: "html",
              value: "[!TIP]\n",
            },
            {
              type: "text",
              value:
                "If you set an empty value for an environment variable, " +
                "the app behaves as if that variable isn't set.",
            },
          ],
        },
      ],
    },
    {
      type: "html",
      value: "<!-- prettier-ignore-end -->",
    },
  ];
}

function specificationAST(variables: Variable<unknown>[]): RootContent[] {
  return variables.flatMap((v) => variableAST(v));
}

function variableAST(variable: Variable<unknown>): RootContent[] {
  const {
    spec: { name, description },
  } = variable;

  return [
    {
      type: "heading",
      depth: 2,
      children: [
        {
          type: "inlineCode",
          value: name,
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          type: "emphasis",
          children: userContent(uppercaseFirst(description)),
        },
      ],
    },

    ...variable.spec.schema.accept(createSchemaASTVisitor(variable)),
    ...variableDefaultAST(variable),
    ...variableExamplesAST(variable),
  ];
}

function createSchemaASTVisitor(
  variable: Variable<unknown>,
): Visitor<RootContent[]> {
  const {
    spec: { name, default: def },
  } = variable;
  const isOptional = Boolean(def.isDefined);

  return {
    visitEnum({ members, constraints }) {
      const extrinsic = extrinsicConstraints(constraints);
      const hasConstraints = extrinsic.length > 0;

      const literals = Object.keys(members);

      const listFormatter = createDisjunctionFormatter();
      const affixes = listFormatter
        .format(Array.from(literals).fill("%s"))
        .split("%s");

      const description: PhrasingContent[] = [];
      let i = 0;

      for (; i < literals.length; i++) {
        description.push({ type: "text", value: affixes[i] });
        description.push({ type: "inlineCode", value: quote(literals[i]) });
      }

      description.push({
        type: "text",
        value: hasConstraints
          ? `${affixes[i]}, with these constraints:`
          : `${affixes[i]}.`,
      });

      return [...schemaAST(name, isOptional, extrinsic, description)];
    },

    visitScalar({ description, constraints }) {
      const extrinsic = extrinsicConstraints(constraints);
      const hasConstraints = extrinsic.length > 0;

      return [
        ...schemaAST(name, isOptional, extrinsic, [
          {
            type: "strong",
            children: [
              {
                type: "text",
                value: description,
              },
            ],
          },
          {
            type: "text",
            value: hasConstraints
              ? " values, with these constraints:"
              : " values.",
          },
        ]),
      ];
    },

    visitURL({ base, constraints }) {
      const extrinsic = extrinsicConstraints(constraints);
      const hasConstraints = extrinsic.length > 0;

      const description: PhrasingContent[] = base
        ? [
            {
              type: "strong",
              children: [
                {
                  type: "text",
                  value: "absolute URL",
                },
              ],
            },
            {
              type: "text",
              value: " values, or ",
            },
            {
              type: "strong",
              children: [
                {
                  type: "text",
                  value: "relative URL",
                },
              ],
            },
            {
              type: "text",
              value: " values relative to ",
            },
            {
              type: "inlineCode",
              value: quote(base.toString()),
            },
            {
              type: "text",
              value: hasConstraints ? ", with these constraints:" : ".",
            },
          ]
        : [
            {
              type: "strong",
              children: [
                {
                  type: "text",
                  value: "absolute URL",
                },
              ],
            },
            {
              type: "text",
              value: hasConstraints
                ? " values, with these constraints:"
                : " values.",
            },
          ];

      return [...schemaAST(name, isOptional, extrinsic, description)];
    },
  };
}

function schemaAST(
  name: string,
  isOptional: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constraints: ExtrinsicConstraint<any>[],
  description: PhrasingContent[],
): RootContent[] {
  const optionality: PhrasingContent[] = isOptional
    ? [
        {
          type: "text",
          value: " variable is an ",
        },
        {
          type: "strong",
          children: [
            {
              type: "text",
              value: "optional",
            },
          ],
        },
      ]
    : [
        {
          type: "text",
          value: " variable is a ",
        },
        {
          type: "strong",
          children: [
            {
              type: "text",
              value: "required",
            },
          ],
        },
      ];

  return [
    {
      type: "paragraph",
      children: [
        {
          type: "text",
          value: "The ",
        },
        {
          type: "inlineCode",
          value: name,
        },
        ...optionality,
        {
          type: "text",
          value: " variable that takes ",
        },
        ...description,
      ],
    },
    ...variableConstraintsAST(constraints),
  ];
}

function variableConstraintsAST(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constraints: ExtrinsicConstraint<any>[],
): RootContent[] {
  if (constraints.length < 1) return [];

  return [
    {
      type: "list",
      spread: false,
      children: constraints.map((c) => ({
        type: "listItem",
        children: [
          {
            type: "paragraph",
            children: userContent(uppercaseFirst(c.description)),
          },
        ],
      })),
    },
  ];
}

function variableDefaultAST(variable: Variable<unknown>): RootContent[] {
  const {
    spec: { name, default: def, isSensitive },
    marshal,
  } = variable;

  if (!def.isDefined || typeof def.value === "undefined") return [];

  const example: RootContent[] = isSensitive
    ? [
        {
          type: "html",
          value: "<!-- prettier-ignore-start -->",
        },
        {
          type: "blockquote",
          children: [
            {
              type: "paragraph",
              children: [
                {
                  type: "html",
                  value: "[!NOTE]\n",
                },
                {
                  type: "text",
                  value: "The ",
                },
                {
                  type: "inlineCode",
                  value: name,
                },
                {
                  type: "text",
                  value:
                    " variable is sensitive, so the default value can't be shown.",
                },
              ],
            },
          ],
        },
        {
          type: "html",
          value: "<!-- prettier-ignore-end -->",
        },
      ]
    : [
        {
          type: "code",
          lang: "sh",
          value: `export ${name}=${quote(marshal(def.value))} # default`,
        },
      ];

  return [
    {
      type: "heading",
      depth: 3,
      children: [
        {
          type: "text",
          value: "Default value",
        },
      ],
    },
    ...example,
  ];
}

function variableExamplesAST(variable: Variable<unknown>): RootContent[] {
  const {
    spec: { examples },
  } = variable;
  return [
    {
      type: "heading",
      depth: 3,
      children: [
        {
          type: "text",
          value: "Example values",
        },
      ],
    },

    ...examples.flatMap((e) => variableExampleAST(variable, e)),
  ];
}

function variableExampleAST(
  variable: Variable<unknown>,
  example: Example<unknown>,
): RootContent[] {
  const {
    spec: { name },
    marshal,
  } = variable;
  const { as, label } = example;
  const value = as ?? marshal(example.value);

  return [
    {
      type: "code",
      lang: "sh",
      value: `export ${name}=${quote(value)} # ${label}`,
    },
  ];
}

function uppercaseFirst(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function headingLink(heading: string): string {
  return `#${heading.toLowerCase()}`;
}

function userContent(markdown: string): PhrasingContent[] {
  const ast = fromMarkdown(markdown);

  if (ast.children[0].type !== "paragraph") {
    return [{ type: "text", value: markdown }];
  }

  return ast.children[0].children;
}
