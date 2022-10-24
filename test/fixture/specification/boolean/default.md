# Environment Variables

This document describes the environment variables used by `<app>`.

Please note that **undefined** variables and **empty strings** are considered
equivalent.

The application may consume other undocumented environment variables; this
document only shows those variables defined using [Austenite].

[austenite]: https://github.com/eloquent/austenite

## Index

- [`DEBUG`](#DEBUG) — enable or disable debugging features
- [`PRODUCTION`](#PRODUCTION) — enable or disable production mode

## Specification

### `DEBUG`

> enable or disable debugging features

This variable **MAY** be set to one of the values below.
If left undefined the default value is used (see below).

```sh
export DEBUG=true  # true
export DEBUG=false # false (default)
```

### `PRODUCTION`

> enable or disable production mode

This variable **MAY** be set to one of the values below.
If left undefined the default value is used (see below).

```sh
export PRODUCTION=true  # true (default)
export PRODUCTION=false # false
```
