# Environment Variables

This document describes the environment variables used by `<app>`.

Please note that **undefined** variables and **empty strings** are considered
equivalent.

The application may consume other undocumented environment variables; this
document only shows those variables defined using [Austenite].

[austenite]: https://github.com/ezzatron/austenite

## Index

- [`GRPC_TIMEOUT`](#GRPC_TIMEOUT) — gRPC request timeout

## Specification

### `GRPC_TIMEOUT`

> gRPC request timeout

This variable **MAY** be set to a non-empty **ISO 8601 duration** or left undefined.

```sh
export GRPC_TIMEOUT=PT1M30S    # ISO 8601 duration
export GRPC_TIMEOUT=P1M15DT12H # ISO 8601 duration
```
