# Environment Variables

This document describes the environment variables used by `<app>`.

Please note that **undefined** variables and **empty strings** are considered
equivalent.

The application may consume other undocumented environment variables; this
document only shows those variables defined using [Austenite].

[austenite]: https://github.com/eloquent/austenite

## Index

- [`READ_DSN`](#READ_DSN) — database connection string for read-models

## Specification

### `READ_DSN`

> database connection string for read-models

This variable **MAY** be set to a non-empty **string**.
If left undefined the default value is used (see below).

```sh
export READ_DSN='host=localhost dbname=readmodels user=projector' # (default)
export READ_DSN=conquistador                                      # any value
export READ_DSN='alabaster parakeet'                              # some values may need escaping
```
