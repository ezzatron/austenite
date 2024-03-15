# Environment Variables

This document describes the environment variables used by `<app>`.

Please note that **undefined** variables and **empty strings** are considered
equivalent.

The application may consume other undocumented environment variables; this
document only shows those variables defined using [Austenite].

[austenite]: https://github.com/ezzatron/austenite

## Index

- [`DEBUG`](#DEBUG) — enable or disable debugging features

## Specification

### `DEBUG`

> enable or disable debugging features

This variable **MAY** be set to one of the values below or left undefined.

```sh
export DEBUG=true  # true
export DEBUG=false # false
```

## Usage Examples

<details><summary><strong>Kubernetes</strong></summary><br>

This example shows how to define the environment variables needed by `<app>`
on a [Kubernetes container] within a Kubenetes deployment manifest.

[kubernetes container]: https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/#define-an-environment-variable-for-a-container

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: example-deployment
spec:
  template:
    spec:
      containers:
        - name: example-container
          env:
            - name: DEBUG # enable or disable debugging features
              value: "true"
```

Alternatively, the environment variables can be defined within a [config map]
then referenced a deployment manifest using `configMapRef`.

[config map]: https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#configure-all-key-value-pairs-in-a-configmap-as-container-environment-variables

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: example-config-map
data:
  DEBUG: "true" # enable or disable debugging features
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: example-deployment
spec:
  template:
    spec:
      containers:
        - name: example-container
          envFrom:
            - configMapRef:
                name: example-config-map
```

</details>

<details><summary><strong>Docker</strong></summary><br>

This example shows how to define the environment variables needed by `<app>`
when running as a [Docker service] defined in a Docker compose file.

[docker service]: https://docs.docker.com/compose/environment-variables/#set-environment-variables-in-containers

```yaml
service:
  example-service:
    environment:
      DEBUG: "true" # enable or disable debugging features
```

</details>
