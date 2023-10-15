# Environment Variables

This document describes the environment variables used by `<app>`.

Please note that **undefined** variables and **empty strings** are considered
equivalent.

The application may consume other undocumented environment variables; this
document only shows those variables defined using [Austenite].

[austenite]: https://github.com/ezzatron/austenite

## Index

- [`PORT`](#PORT) — listen port for the HTTP server

## Specification

### `PORT`

> listen port for the HTTP server

This variable **MUST** be set to a non-empty **port number**.
If left undefined the application will print usage information to `STDERR` then
exit with a non-zero exit code.

```sh
export PORT=12345 # a port number
```
