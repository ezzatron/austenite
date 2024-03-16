# Environment Variables

This document describes the environment variables used by `<app>`.

Please note that **undefined** variables and **empty strings** are considered
equivalent.

The application may consume other undocumented environment variables; this
document only shows those variables defined using [Austenite].

[austenite]: https://github.com/ezzatron/austenite

## Index

- [`LOGO`](#LOGO) — Main logo image

## Specification

### `LOGO`

> Main logo image

This variable **MUST** be set to a non-empty **URL** value.
If left undefined, the application will print usage information to `STDERR` then
exit with a non-zero exit code.

```sh
export LOGO=https://host.example.org/path/to/resource # URL (absolute)
export LOGO=path/to/resource                          # URL (relative)
```
