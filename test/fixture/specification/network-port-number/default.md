# Environment Variables

This document describes the environment variables used by `<app>`.

Please note that **undefined** variables and **empty strings** are considered
equivalent.

The application may consume other undocumented environment variables; this
document only shows those variables defined using [Austenite].

[austenite]: https://github.com/eloquent/austenite

## Index

- [`PORT`](#PORT) — listen port for the HTTP server

## Specification

### `PORT`

> listen port for the HTTP server

This variable **MAY** be set to a non-empty **port number**.
If left undefined the default value is used (see below).

```sh
export PORT=8080  # (default)
export PORT=12345 # a port number
```
