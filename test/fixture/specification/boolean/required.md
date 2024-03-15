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

This variable **MUST** be set to one of the values below.
If left undefined the application will print usage information to `STDERR` then
exit with a non-zero exit code.

```sh
export DEBUG=true  # true
export DEBUG=false # false
```
