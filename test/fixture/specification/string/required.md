# Environment Variables

This document describes the environment variables used by `<app>`.

Please note that **undefined** variables and **empty strings** are considered
equivalent.

The application may consume other undocumented environment variables; this
document only shows those variables defined using [Austenite].

[austenite]: https://github.com/env-iron/austenite

## Index

-   [`READ_DSN`](#READ_DSN) — database connection string for read-models

## Specification

### `READ_DSN`

> database connection string for read-models

This variable **MUST** be set to a non-empty string.
If left undefined the application will print usage information to `STDERR` then
exit with a non-zero exit code.

```sh
export READ_DSN=conquistador         # any value
export READ_DSN='alabaster parakeet' # some values may need escaping
```
