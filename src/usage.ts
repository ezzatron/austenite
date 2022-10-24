import { code, inlineCode } from "./markdown.js";
import { Variable } from "./variable.js";

export function usage(app: string, variables: Variable<unknown>[]): string {
  return `## Usage Examples

${kubernetesUsage(app, variables)}

${dockerUsage(app, variables)}`;
}

function kubernetesUsage(app: string, variables: Variable<unknown>[]): string {
  const appCode = inlineCode(app);

  return `<details><summary><strong>Kubernetes</strong></summary><br>

This example shows how to define the environment variables needed by ${appCode}
on a [Kubernetes container] within a Kubenetes deployment manifest.

[kubernetes container]: https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/#define-an-environment-variable-for-a-container

${code("yaml", k8sDeploymentYaml(variables))}

Alternatively, the environment variables can be defined within a [config map]
then referenced a deployment manifest using \`configMapRef\`.

[config map]: https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#configure-all-key-value-pairs-in-a-configmap-as-container-environment-variables

${code("yaml", k8sConfigMapYaml(variables))}

</details>`;
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

function dockerUsage(app: string, variables: Variable<unknown>[]): string {
  const appCode = inlineCode(app);

  return `<details><summary><strong>Docker</strong></summary><br>

This example shows how to define the environment variables needed by ${appCode}
when running as a [Docker service] defined in a Docker compose file.

[docker service]: https://docs.docker.com/compose/environment-variables/#set-environment-variables-in-containers

${code("yaml", dockerComposeYaml(variables))}

</details>`;
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
