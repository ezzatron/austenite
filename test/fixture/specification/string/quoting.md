# Environment Variables

This document describes the environment variables used by `<app>`.

Please note that **undefined** variables and **empty strings** are considered
equivalent.

The application may consume other undocumented environment variables; this
document only shows those variables defined using [Austenite].

[austenite]: https://github.com/eloquent/austenite

## Index

-   [`MESSAGE`](#MESSAGE) — message to output

## Specification

### `MESSAGE`

> message to output

This variable **MAY** be set to a non-empty **string**.
If left undefined the default value is used (see below).

```sh
export MESSAGE='Season'"'"'s greetings, world!' # (default)
export MESSAGE=conquistador                     # any value
export MESSAGE='alabaster parakeet'             # some values may need escaping
```
