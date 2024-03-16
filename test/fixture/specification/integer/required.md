# Environment Variables

This document describes the environment variables used by `<app>`.

Please note that **undefined** variables and **empty strings** are considered
equivalent.

The application may consume other undocumented environment variables; this
document only shows those variables defined using [Austenite].

[austenite]: https://github.com/ezzatron/austenite

## Index

- [`WEIGHT`](#WEIGHT) — weighting for this node

## Specification

### `WEIGHT`

> weighting for this node

This variable **MUST** be set to a non-empty **integer** value.
If left undefined, the application will print usage information to `STDERR` then
exit with a non-zero exit code.

```sh
export WEIGHT=123456              # positive
export WEIGHT=-123456             # negative
export WEIGHT=1.23456e+5          # exponential
export WEIGHT=0x1E240             # hexadecimal
export WEIGHT=0o361100            # octal
export WEIGHT=0b11110001001000000 # binary
```
