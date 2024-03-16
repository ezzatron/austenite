# Environment Variables

This document describes the environment variables used by `<app>`.

Please note that **undefined** variables and **empty strings** are considered
equivalent.

The application may consume other undocumented environment variables; this
document only shows those variables defined using [Austenite].

[austenite]: https://github.com/ezzatron/austenite

## Index

- [`AUSTENITE_BINARY`](#AUSTENITE_BINARY) — example binary
- [`AUSTENITE_BOOLEAN`](#AUSTENITE_BOOLEAN) — example boolean
- [`AUSTENITE_DURATION`](#AUSTENITE_DURATION) — example duration
- [`AUSTENITE_ENUMERATION`](#AUSTENITE_ENUMERATION) — example enumeration
- [`AUSTENITE_INTEGER`](#AUSTENITE_INTEGER) — example integer
- [`AUSTENITE_INTEGER_BIG`](#AUSTENITE_INTEGER_BIG) — example big integer
- [`AUSTENITE_NUMBER`](#AUSTENITE_NUMBER) — example number
- [`AUSTENITE_PORT_NUMBER`](#AUSTENITE_PORT_NUMBER) — example port number
- [`AUSTENITE_STRING`](#AUSTENITE_STRING) — example string
- [`AUSTENITE_SVC_SERVICE_HOST`](#AUSTENITE_SVC_SERVICE_HOST) — kubernetes `austenite-svc` service host
- [`AUSTENITE_SVC_SERVICE_PORT`](#AUSTENITE_SVC_SERVICE_PORT) — kubernetes `austenite-svc` service port
- [`AUSTENITE_URL`](#AUSTENITE_URL) — example URL
- [`AUSTENITE_XTRIGGER`](#AUSTENITE_XTRIGGER) — trigger failure

## Specification

### `AUSTENITE_BINARY`

> example binary

This variable **MAY** be set to a non-empty **base64** value.
If left undefined a default value is used.

```sh
export AUSTENITE_BINARY=Y29ucXVpc3RhZG9y # base64 encoded string
```

### `AUSTENITE_BOOLEAN`

> example boolean

This variable **MAY** be set to one of the values below.
If left undefined a default value is used.

```sh
export AUSTENITE_BOOLEAN=y   # true
export AUSTENITE_BOOLEAN=yes # true
export AUSTENITE_BOOLEAN=n   # false
export AUSTENITE_BOOLEAN=no  # false
```

### `AUSTENITE_DURATION`

> example duration

This variable **MAY** be set to a non-empty **ISO 8601 duration** value.
If left undefined a default value is used.

```sh
export AUSTENITE_DURATION=PT1M30S    # ISO 8601 duration
export AUSTENITE_DURATION=P1M15DT12H # ISO 8601 duration
```

### `AUSTENITE_ENUMERATION`

> example enumeration

This variable **MAY** be set to one of the values below.
If left undefined a default value is used.

```sh
export AUSTENITE_ENUMERATION=foo # foo
export AUSTENITE_ENUMERATION=bar # bar
export AUSTENITE_ENUMERATION=baz # baz
```

### `AUSTENITE_INTEGER`

> example integer

This variable **MAY** be set to a non-empty **integer** value.
If left undefined a default value is used.

```sh
export AUSTENITE_INTEGER=123456              # positive
export AUSTENITE_INTEGER=-123456             # negative
export AUSTENITE_INTEGER=1.23456e+5          # exponential
export AUSTENITE_INTEGER=0x1E240             # hexadecimal
export AUSTENITE_INTEGER=0o361100            # octal
export AUSTENITE_INTEGER=0b11110001001000000 # binary
```

### `AUSTENITE_INTEGER_BIG`

> example big integer

This variable **MAY** be set to a non-empty **big integer** value.
If left undefined a default value is used.

```sh
export AUSTENITE_INTEGER_BIG=123456              # positive
export AUSTENITE_INTEGER_BIG=-123456             # negative
export AUSTENITE_INTEGER_BIG=0x1E240             # hexadecimal
export AUSTENITE_INTEGER_BIG=0o361100            # octal
export AUSTENITE_INTEGER_BIG=0b11110001001000000 # binary
```

### `AUSTENITE_NUMBER`

> example number

This variable **MAY** be set to a non-empty **number** value.
If left undefined a default value is used.

```sh
export AUSTENITE_NUMBER=123456              # integer
export AUSTENITE_NUMBER=123.456             # positive
export AUSTENITE_NUMBER=-123.456            # negative
export AUSTENITE_NUMBER=1.23456e+2          # exponential
export AUSTENITE_NUMBER=0x1E240             # hexadecimal
export AUSTENITE_NUMBER=0o361100            # octal
export AUSTENITE_NUMBER=0b11110001001000000 # binary
```

### `AUSTENITE_PORT_NUMBER`

> example port number

This variable **MAY** be set to a non-empty **port number** value.
If left undefined a default value is used.

```sh
export AUSTENITE_PORT_NUMBER=12345 # a port number
```

### `AUSTENITE_STRING`

> example string

This variable **MAY** be set to a non-empty **string** value.
If left undefined a default value is used.

```sh
export AUSTENITE_STRING=conquistador         # any value
export AUSTENITE_STRING='alabaster parakeet' # some values may need escaping
```

### `AUSTENITE_SVC_SERVICE_HOST`

> kubernetes `austenite-svc` service host

This variable **MAY** be set to a non-empty **hostname** value.
If left undefined a default value is used.

```sh
export AUSTENITE_SVC_SERVICE_HOST=service.example.org # a hostname
export AUSTENITE_SVC_SERVICE_HOST=10.0.0.11           # an IP address
```

### `AUSTENITE_SVC_SERVICE_PORT`

> kubernetes `austenite-svc` service port

This variable **MAY** be set to a non-empty **port number** value.
If left undefined a default value is used.

```sh
export AUSTENITE_SVC_SERVICE_PORT=12345 # a port number
```

### `AUSTENITE_URL`

> example URL

This variable **MAY** be set to a non-empty **URL** value.
If left undefined a default value is used.

```sh
export AUSTENITE_URL=https://host.example.org/path/to/resource # URL (absolute)
```

### `AUSTENITE_XTRIGGER`

> trigger failure

This variable **MUST** be set to a non-empty **string** value.
If left undefined the application will print usage information to `STDERR` then
exit with a non-zero exit code.

```sh
export AUSTENITE_XTRIGGER=conquistador         # any value
export AUSTENITE_XTRIGGER='alabaster parakeet' # some values may need escaping
```
