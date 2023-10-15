# Environment Variables

This document describes the environment variables used by `<app>`.

Please note that **undefined** variables and **empty strings** are considered
equivalent.

The application may consume other undocumented environment variables; this
document only shows those variables defined using [Austenite].

[austenite]: https://github.com/ezzatron/austenite

## Index

- [`REDIS_PRIMARY_SERVICE_HOST`](#REDIS_PRIMARY_SERVICE_HOST) — kubernetes `redis-primary` service host
- [`REDIS_PRIMARY_SERVICE_PORT`](#REDIS_PRIMARY_SERVICE_PORT) — kubernetes `redis-primary` service port

## Specification

### `REDIS_PRIMARY_SERVICE_HOST`

> kubernetes `redis-primary` service host

This variable **MAY** be set to a non-empty **hostname** or left undefined.

```sh
export REDIS_PRIMARY_SERVICE_HOST=service.example.org # a hostname
export REDIS_PRIMARY_SERVICE_HOST=10.0.0.11           # an IP address
```

### `REDIS_PRIMARY_SERVICE_PORT`

> kubernetes `redis-primary` service port

This variable **MAY** be set to a non-empty **port number** or left undefined.

```sh
export REDIS_PRIMARY_SERVICE_PORT=12345 # a port number
```
