# Environment Variables

This document describes the environment variables used by `<app>`.

Please note that **undefined** variables and **empty strings** are considered
equivalent.

The application may consume other undocumented environment variables; this
document only shows those variables defined using [Austenite].

[austenite]: https://github.com/env-iron/austenite

## Index

-   [`REDIS_PRIMARY_SERVICE_HOST`](#REDIS_PRIMARY_SERVICE_HOST) — kubernetes "redis-primary" service host
-   [`REDIS_PRIMARY_SERVICE_PORT_DB`](#REDIS_PRIMARY_SERVICE_PORT_DB) — kubernetes "redis-primary" service "db" port
-   [`REDIS_PRIMARY_SERVICE_PORT_OBSERVABILITY`](#REDIS_PRIMARY_SERVICE_PORT_OBSERVABILITY) — kubernetes "redis-primary" service "observability" port

## Specification

### `REDIS_PRIMARY_SERVICE_HOST`

> kubernetes "redis-primary" service host

This variable **MUST** be set to a non-empty string.
If left undefined the application will print usage information to `STDERR` then
exit with a non-zero exit code.

```sh
export REDIS_PRIMARY_SERVICE_HOST=service.example.org # a hostname
export REDIS_PRIMARY_SERVICE_HOST=10.0.0.11           # an IP address
```

### `REDIS_PRIMARY_SERVICE_PORT_DB`

> kubernetes "redis-primary" service "db" port

This variable **MUST** be set to a non-empty string.
If left undefined the application will print usage information to `STDERR` then
exit with a non-zero exit code.

```sh
export REDIS_PRIMARY_SERVICE_PORT_DB=12345 # a port number
```

### `REDIS_PRIMARY_SERVICE_PORT_OBSERVABILITY`

> kubernetes "redis-primary" service "observability" port

This variable **MUST** be set to a non-empty string.
If left undefined the application will print usage information to `STDERR` then
exit with a non-zero exit code.

```sh
export REDIS_PRIMARY_SERVICE_PORT_OBSERVABILITY=12345 # a port number
```
