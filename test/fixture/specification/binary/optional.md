# Environment Variables

This document describes the environment variables used by `<app>`.

Please note that **undefined** variables and **empty strings** are considered
equivalent.

The application may consume other undocumented environment variables; this
document only shows those variables defined using [Austenite].

[austenite]: https://github.com/ezzatron/austenite

## Index

- [`SESSION_KEY`](#SESSION_KEY) — session token signing key

## Specification

### `SESSION_KEY`

> session token signing key

This variable **MAY** be set to a non-empty **base64** value or left undefined.

```sh
export SESSION_KEY=Y29ucXVpc3RhZG9y # base64 encoded string
```