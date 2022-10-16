import type { Definition, LinkReference } from "mdast-util-from-markdown/lib";
import { Content } from "mdast-util-to-markdown/lib/types";
import { markdownToContentArray } from "./markdown";
import { Variable } from "./variable";

export function usage(app: string, variables: Variable<unknown>[]): Content[] {
  if (variables.length < 1) return [];

  return [
    {
      type: "heading",
      depth: 2,
      children: [
        {
          type: "text",
          value: "Usage Examples",
        },
      ],
    },

    ...kubernetesUsage(app, variables),
    ...dockerUsage(app, variables),
  ];
}

function kubernetesUsage(
  app: string,
  variables: Variable<unknown>[]
): Content[] {
  return [
    {
      type: "html",
      value: "<details>\n<summary>Kubernetes</summary>",
    },
    {
      type: "paragraph",
      children: [
        {
          type: "text",
          value:
            "This example shows how to define the environment variables needed by ",
        },
        {
          type: "inlineCode",
          value: app,
        },
        {
          type: "text",
          value: "\non a ",
        },
        {
          type: "linkReference",
          label: "Kubernetes container",
          referenceType: "shortcut",
          children: [
            {
              type: "text",
              value: "Kubernetes container",
            },
          ],
        } as LinkReference,
        {
          type: "text",
          value: " within a Kubenetes deployment manifest.",
        },
      ],
    },
    {
      type: "definition",
      label: "kubernetes container",
      url: "https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/#define-an-environment-variable-for-a-container",
    } as Definition,
    {
      type: "code",
      lang: "yaml",
      value: k8sDeploymentYaml(variables),
    },
    ...markdownToContentArray<Content>(
      [
        "Alternatively, the environment variables can be defined within a [config map]",
        "then referenced a deployment manifest using `configMapRef`.",
        "",
        "[config map]: https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#configure-all-key-value-pairs-in-a-configmap-as-container-environment-variables",
      ].join("\n")
    ),
    {
      type: "code",
      lang: "yaml",
      value: k8sConfigMapYaml(variables),
    },
    {
      type: "html",
      value: "</details>",
    },
  ];
}

function k8sDeploymentYaml(variables: Variable<unknown>[]): string {
  return [
    "apiVersion: apps/v1",
    "kind: Deployment",
    "metadata:",
    "  name: example-deployment",
    "spec:",
    "  template:",
    "    spec:",
    "      containers:",
    "        - name: example-container",
    "          env:",
    ...variables.map(({ spec: { name, description, examples } }) => {
      const [example] = examples;
      const value = JSON.stringify(example.canonical);

      return [
        `            - name: ${name} # ${description}`,
        `              value: ${value}`,
      ].join("\n");
    }),
  ].join("\n");
}

function k8sConfigMapYaml(variables: Variable<unknown>[]): string {
  return [
    "apiVersion: v1",
    "kind: ConfigMap",
    "metadata:",
    "  name: example-config-map",
    "data:",
    ...variables.map(({ spec: { name, description, examples } }) => {
      const [example] = examples;
      const value = JSON.stringify(example.canonical);

      return `  ${name}: ${value} # ${description}`;
    }),
    "---",
    "apiVersion: apps/v1",
    "kind: Deployment",
    "metadata:",
    "  name: example-deployment",
    "spec:",
    "  template:",
    "    spec:",
    "      containers:",
    "        - name: example-container",
    "          envFrom:",
    "            - configMapRef:",
    "                name: example-config-map",
  ].join("\n");
}

function dockerUsage(app: string, variables: Variable<unknown>[]): Content[] {
  return [
    {
      type: "html",
      value: "<details>\n<summary>Docker</summary>",
    },
    {
      type: "paragraph",
      children: [
        {
          type: "text",
          value:
            "This example shows how to define the environment variables needed by ",
        },
        {
          type: "inlineCode",
          value: app,
        },
        {
          type: "text",
          value: "\nwhen running as a ",
        },
        {
          type: "linkReference",
          label: "Docker service",
          referenceType: "shortcut",
          children: [
            {
              type: "text",
              value: "Docker service",
            },
          ],
        } as LinkReference,
        {
          type: "text",
          value: " defined in a Docker compose file.",
        },
      ],
    },
    {
      type: "definition",
      label: "docker service",
      url: "https://docs.docker.com/compose/environment-variables/#set-environment-variables-in-containers",
    } as Definition,
    {
      type: "code",
      lang: "yaml",
      value: dockerComposeYaml(variables),
    },
    {
      type: "html",
      value: "</details>",
    },
  ];
}

function dockerComposeYaml(variables: Variable<unknown>[]): string {
  return [
    "service:",
    "  example-service:",
    "    environment:",
    ...variables.map(({ spec: { name, description, examples } }) => {
      const [example] = examples;
      const value = JSON.stringify(example.canonical);

      return `      ${name}: ${value} # ${description}`;
    }),
  ].join("\n");
}
