import { Content } from "mdast-util-to-markdown/lib/types";
import { markdownToContent, markdownToContentArray } from "./markdown";
import { Variable } from "./variable";

export function usage(app: string, variables: Variable<unknown>[]): Content[] {
  if (variables.length < 1) return [];

  return [
    markdownToContent<Content>("## Usage Examples"),
    ...kubernetesUsage(app, variables),
    ...dockerUsage(app, variables),
  ];
}

function kubernetesUsage(
  app: string,
  variables: Variable<unknown>[]
): Content[] {
  return [
    ...markdownToContentArray<Content>(
      ["<details>", "<summary>Kubernetes</summary>"].join("\n")
    ),
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
          identifier: "",
          label: "Kubernetes container",
          referenceType: "shortcut",
          children: [
            {
              type: "text",
              value: "Kubernetes container",
            },
          ],
        },
        {
          type: "text",
          value: " within a Kubenetes deployment manifest.",
        },
      ],
    },
    markdownToContent<Content>(
      "[kubernetes container]: https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/#define-an-environment-variable-for-a-container"
    ),
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
    markdownToContent<Content>("</details>"),
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
    ...markdownToContentArray<Content>(
      ["<details>", "<summary>Docker</summary>"].join("\n")
    ),
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
          identifier: "",
          label: "Docker service",
          referenceType: "shortcut",
          children: [
            {
              type: "text",
              value: "Docker service",
            },
          ],
        },
        {
          type: "text",
          value: " defined in a Docker compose file.",
        },
      ],
    },
    markdownToContent<Content>(
      "[docker service]: https://docs.docker.com/compose/environment-variables/#set-environment-variables-in-containers"
    ),
    {
      type: "code",
      lang: "yaml",
      value: dockerComposeYaml(variables),
    },
    markdownToContent<Content>("</details>"),
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
