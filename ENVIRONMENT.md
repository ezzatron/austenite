# Environment Variables

This document describes the environment variables used by `run.ts`.

Please note that **undefined** variables and **empty strings** are considered
equivalent.

The application may consume other undocumented environment variables; this
document only shows those variables defined using [Austenite].

[austenite]: https://github.com/eloquent/austenite

## Index

-   [`CDN_URL`](#CDN_URL) — CDN to use when serving static assets
-   [`DEBUG`](#DEBUG) — enable or disable debugging features
-   [`EARTH_ATOM_COUNT`](#EARTH_ATOM_COUNT) — number of atoms on earth
-   [`GRPC_TIMEOUT`](#GRPC_TIMEOUT) — gRPC request timeout
-   [`LOG_LEVEL`](#LOG_LEVEL) — the minimum log level to record
-   [`READ_DSN`](#READ_DSN) — database connection string for read-models
-   [`REDIS_PRIMARY_SERVICE_HOST`](#REDIS_PRIMARY_SERVICE_HOST) — kubernetes `redis-primary` service host
-   [`REDIS_PRIMARY_SERVICE_PORT`](#REDIS_PRIMARY_SERVICE_PORT) — kubernetes `redis-primary` service port
-   [`SAMPLE_RATIO`](#SAMPLE_RATIO) — ratio of requests to sample
-   [`WEIGHT`](#WEIGHT) — weighting for this node

## Specification

### `CDN_URL`

> CDN to use when serving static assets

This variable **MUST** be set to a non-empty **URL**.
If left undefined the application will print usage information to `STDERR` then
exit with a non-zero exit code.

```sh
export CDN_URL=https://host.example.org/path/to/resource # URL (absolute)
```

### `DEBUG`

> enable or disable debugging features

This variable **MUST** be set to one of the values below.
If left undefined the application will print usage information to `STDERR` then
exit with a non-zero exit code.

```sh
export DEBUG=true  # true
export DEBUG=false # false
```

### `EARTH_ATOM_COUNT`

> number of atoms on earth

This variable **MUST** be set to a non-empty **big integer**.
If left undefined the application will print usage information to `STDERR` then
exit with a non-zero exit code.

```sh
export EARTH_ATOM_COUNT=123456              # positive
export EARTH_ATOM_COUNT=-123456             # negative
export EARTH_ATOM_COUNT=0x1E240             # hexadecimal
export EARTH_ATOM_COUNT=0o361100            # octal
export EARTH_ATOM_COUNT=0b11110001001000000 # binary
```

### `GRPC_TIMEOUT`

> gRPC request timeout

This variable **MUST** be set to a non-empty **ISO 8601 duration**.
If left undefined the application will print usage information to `STDERR` then
exit with a non-zero exit code.

```sh
export GRPC_TIMEOUT=PT1M30S    # ISO 8601 duration
export GRPC_TIMEOUT=P1M15DT12H # ISO 8601 duration
```

### `LOG_LEVEL`

> the minimum log level to record

This variable **MUST** be set to one of the values below.
If left undefined the application will print usage information to `STDERR` then
exit with a non-zero exit code.

```sh
export LOG_LEVEL=debug # show information for developers
export LOG_LEVEL=info  # standard log messages
export LOG_LEVEL=warn  # important, but don't need individual human review
export LOG_LEVEL=error # a healthy application shouldn't produce any errors
export LOG_LEVEL=fatal # the application cannot proceed
```

### `READ_DSN`

> database connection string for read-models

This variable **MUST** be set to a non-empty **string**.
If left undefined the application will print usage information to `STDERR` then
exit with a non-zero exit code.

```sh
export READ_DSN=conquistador         # any value
export READ_DSN='alabaster parakeet' # some values may need escaping
```

### `REDIS_PRIMARY_SERVICE_HOST`

> kubernetes `redis-primary` service host

This variable **MUST** be set to a non-empty **hostname**.
If left undefined the application will print usage information to `STDERR` then
exit with a non-zero exit code.

```sh
export REDIS_PRIMARY_SERVICE_HOST=service.example.org # a hostname
export REDIS_PRIMARY_SERVICE_HOST=10.0.0.11           # an IP address
```

### `REDIS_PRIMARY_SERVICE_PORT`

> kubernetes `redis-primary` service port

This variable **MUST** be set to a non-empty **port number**.
If left undefined the application will print usage information to `STDERR` then
exit with a non-zero exit code.

```sh
export REDIS_PRIMARY_SERVICE_PORT=12345 # a port number
```

### `SAMPLE_RATIO`

> ratio of requests to sample

This variable **MUST** be set to a non-empty **number**.
If left undefined the application will print usage information to `STDERR` then
exit with a non-zero exit code.

```sh
export SAMPLE_RATIO=123456              # integer
export SAMPLE_RATIO=123.456             # positive
export SAMPLE_RATIO=-123.456            # negative
export SAMPLE_RATIO=1.23456e+2          # exponential
export SAMPLE_RATIO=0x1E240             # hexadecimal
export SAMPLE_RATIO=0o361100            # octal
export SAMPLE_RATIO=0b11110001001000000 # binary
```

### `WEIGHT`

> weighting for this node

This variable **MUST** be set to a non-empty **integer**.
If left undefined the application will print usage information to `STDERR` then
exit with a non-zero exit code.

```sh
export WEIGHT=123456              # positive
export WEIGHT=-123456             # negative
export WEIGHT=1.23456e+5          # exponential
export WEIGHT=0x1E240             # hexadecimal
export WEIGHT=0o361100            # octal
export WEIGHT=0b11110001001000000 # binary
```

## Usage Examples

<details>
<summary><strong>Kubernetes</strong></summary><br>

This example shows how to define the environment variables needed by `run.ts`
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
            - name: CDN_URL # CDN to use when serving static assets
              value: "https://host.example.org/path/to/resource"
            - name: DEBUG # enable or disable debugging features
              value: "true"
            - name: EARTH_ATOM_COUNT # number of atoms on earth
              value: "123456"
            - name: GRPC_TIMEOUT # gRPC request timeout
              value: "PT1M30S"
            - name: LOG_LEVEL # the minimum log level to record
              value: "debug"
            - name: READ_DSN # database connection string for read-models
              value: "conquistador"
            - name: REDIS_PRIMARY_SERVICE_HOST # kubernetes `redis-primary` service host
              value: "service.example.org"
            - name: REDIS_PRIMARY_SERVICE_PORT # kubernetes `redis-primary` service port
              value: "12345"
            - name: SAMPLE_RATIO # ratio of requests to sample
              value: "123456"
            - name: WEIGHT # weighting for this node
              value: "123456"
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
  CDN_URL: "https://host.example.org/path/to/resource" # CDN to use when serving static assets
  DEBUG: "true" # enable or disable debugging features
  EARTH_ATOM_COUNT: "123456" # number of atoms on earth
  GRPC_TIMEOUT: "PT1M30S" # gRPC request timeout
  LOG_LEVEL: "debug" # the minimum log level to record
  READ_DSN: "conquistador" # database connection string for read-models
  REDIS_PRIMARY_SERVICE_HOST: "service.example.org" # kubernetes `redis-primary` service host
  REDIS_PRIMARY_SERVICE_PORT: "12345" # kubernetes `redis-primary` service port
  SAMPLE_RATIO: "123456" # ratio of requests to sample
  WEIGHT: "123456" # weighting for this node
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

<details>
<summary><strong>Docker</strong></summary><br>

This example shows how to define the environment variables needed by `run.ts`
when running as a [Docker service] defined in a Docker compose file.

[docker service]: https://docs.docker.com/compose/environment-variables/#set-environment-variables-in-containers

```yaml
service:
  example-service:
    environment:
      CDN_URL: "https://host.example.org/path/to/resource" # CDN to use when serving static assets
      DEBUG: "true" # enable or disable debugging features
      EARTH_ATOM_COUNT: "123456" # number of atoms on earth
      GRPC_TIMEOUT: "PT1M30S" # gRPC request timeout
      LOG_LEVEL: "debug" # the minimum log level to record
      READ_DSN: "conquistador" # database connection string for read-models
      REDIS_PRIMARY_SERVICE_HOST: "service.example.org" # kubernetes `redis-primary` service host
      REDIS_PRIMARY_SERVICE_PORT: "12345" # kubernetes `redis-primary` service port
      SAMPLE_RATIO: "123456" # ratio of requests to sample
      WEIGHT: "123456" # weighting for this node
```

</details>
