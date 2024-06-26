# Environment variables

The `<app>` app uses **declarative environment variables** powered by
**[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name                                                        | Usage    | Description                             |
| :---------------------------------------------------------- | :------- | :-------------------------------------- |
| [`AUSTENITE_BINARY`](#austenite_binary)                     | Optional | Example binary                          |
| [`AUSTENITE_BOOLEAN`](#austenite_boolean)                   | Optional | Example boolean                         |
| [`AUSTENITE_DURATION`](#austenite_duration)                 | Optional | Example duration                        |
| [`AUSTENITE_ENUMERATION`](#austenite_enumeration)           | Optional | Example enumeration                     |
| [`AUSTENITE_INTEGER`](#austenite_integer)                   | Optional | Example integer                         |
| [`AUSTENITE_INTEGER_BIG`](#austenite_integer_big)           | Optional | Example big integer                     |
| [`AUSTENITE_NUMBER`](#austenite_number)                     | Optional | Example number                          |
| [`AUSTENITE_PORT_NUMBER`](#austenite_port_number)           | Optional | Example port number                     |
| [`AUSTENITE_STRING`](#austenite_string)                     | Optional | Example string                          |
| [`AUSTENITE_SVC_SERVICE_HOST`](#austenite_svc_service_host) | Optional | Kubernetes `austenite-svc` service host |
| [`AUSTENITE_SVC_SERVICE_PORT`](#austenite_svc_service_port) | Optional | Kubernetes `austenite-svc` service port |
| [`AUSTENITE_URL`](#austenite_url)                           | Optional | Example URL                             |
| [`AUSTENITE_XTRIGGER`](#austenite_xtrigger)                 | Required | Trigger failure                         |

<!-- prettier-ignore-start -->

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if that variable isn't set.

<!-- prettier-ignore-end -->

## `AUSTENITE_BINARY`

_Example binary_

The `AUSTENITE_BINARY` variable is an **optional** variable that takes
**base64** values.

### Default value

<!-- prettier-ignore-start -->

> [!NOTE]
> The `AUSTENITE_BINARY` variable is sensitive, so the default value can't be shown.

<!-- prettier-ignore-end -->

### Example values

```sh
export AUSTENITE_BINARY=Y29ucXVpc3RhZG9y # base64 encoded string
```

## `AUSTENITE_BOOLEAN`

_Example boolean_

The `AUSTENITE_BOOLEAN` variable is an **optional** variable that takes `y`,
`yes`, `n`, or `no`.

### Default value

<!-- prettier-ignore-start -->

> [!NOTE]
> The `AUSTENITE_BOOLEAN` variable is sensitive, so the default value can't be shown.

<!-- prettier-ignore-end -->

### Example values

```sh
export AUSTENITE_BOOLEAN=y # true
```

```sh
export AUSTENITE_BOOLEAN=yes # true
```

```sh
export AUSTENITE_BOOLEAN=n # false
```

```sh
export AUSTENITE_BOOLEAN=no # false
```

## `AUSTENITE_DURATION`

_Example duration_

The `AUSTENITE_DURATION` variable is an **optional** variable that takes **ISO
8601 duration** values.

### Default value

<!-- prettier-ignore-start -->

> [!NOTE]
> The `AUSTENITE_DURATION` variable is sensitive, so the default value can't be shown.

<!-- prettier-ignore-end -->

### Example values

```sh
export AUSTENITE_DURATION=PT1M30S # ISO 8601 duration
```

```sh
export AUSTENITE_DURATION=P1M15DT12H # ISO 8601 duration
```

## `AUSTENITE_ENUMERATION`

_Example enumeration_

The `AUSTENITE_ENUMERATION` variable is an **optional** variable that takes
`foo`, `bar`, or `baz`.

### Default value

<!-- prettier-ignore-start -->

> [!NOTE]
> The `AUSTENITE_ENUMERATION` variable is sensitive, so the default value can't be shown.

<!-- prettier-ignore-end -->

### Example values

```sh
export AUSTENITE_ENUMERATION=foo # foo
```

```sh
export AUSTENITE_ENUMERATION=bar # bar
```

```sh
export AUSTENITE_ENUMERATION=baz # baz
```

## `AUSTENITE_INTEGER`

_Example integer_

The `AUSTENITE_INTEGER` variable is an **optional** variable that takes
**integer** values.

### Default value

<!-- prettier-ignore-start -->

> [!NOTE]
> The `AUSTENITE_INTEGER` variable is sensitive, so the default value can't be shown.

<!-- prettier-ignore-end -->

### Example values

```sh
export AUSTENITE_INTEGER=123456 # positive
```

```sh
export AUSTENITE_INTEGER=-123456 # negative
```

```sh
export AUSTENITE_INTEGER=1.23456e5 # exponential
```

```sh
export AUSTENITE_INTEGER=0x1e240 # hexadecimal
```

```sh
export AUSTENITE_INTEGER=0o361100 # octal
```

```sh
export AUSTENITE_INTEGER=0b11110001001000000 # binary
```

## `AUSTENITE_INTEGER_BIG`

_Example big integer_

The `AUSTENITE_INTEGER_BIG` variable is an **optional** variable that takes
**big integer** values.

### Default value

<!-- prettier-ignore-start -->

> [!NOTE]
> The `AUSTENITE_INTEGER_BIG` variable is sensitive, so the default value can't be shown.

<!-- prettier-ignore-end -->

### Example values

```sh
export AUSTENITE_INTEGER_BIG=123456 # positive
```

```sh
export AUSTENITE_INTEGER_BIG=-123456 # negative
```

```sh
export AUSTENITE_INTEGER_BIG=0x1e240 # hexadecimal
```

```sh
export AUSTENITE_INTEGER_BIG=0o361100 # octal
```

```sh
export AUSTENITE_INTEGER_BIG=0b11110001001000000 # binary
```

## `AUSTENITE_NUMBER`

_Example number_

The `AUSTENITE_NUMBER` variable is an **optional** variable that takes
**number** values.

### Default value

<!-- prettier-ignore-start -->

> [!NOTE]
> The `AUSTENITE_NUMBER` variable is sensitive, so the default value can't be shown.

<!-- prettier-ignore-end -->

### Example values

```sh
export AUSTENITE_NUMBER=123456 # integer
```

```sh
export AUSTENITE_NUMBER=123.456 # positive
```

```sh
export AUSTENITE_NUMBER=-123.456 # negative
```

```sh
export AUSTENITE_NUMBER=1.23456e+2 # exponential
```

```sh
export AUSTENITE_NUMBER=0x1e240 # hexadecimal
```

```sh
export AUSTENITE_NUMBER=0o361100 # octal
```

```sh
export AUSTENITE_NUMBER=0b11110001001000000 # binary
```

## `AUSTENITE_PORT_NUMBER`

_Example port number_

The `AUSTENITE_PORT_NUMBER` variable is an **optional** variable that takes
**port number** values.

### Default value

<!-- prettier-ignore-start -->

> [!NOTE]
> The `AUSTENITE_PORT_NUMBER` variable is sensitive, so the default value can't be shown.

<!-- prettier-ignore-end -->

### Example values

```sh
export AUSTENITE_PORT_NUMBER=12345 # a port number
```

## `AUSTENITE_STRING`

_Example string_

The `AUSTENITE_STRING` variable is an **optional** variable that takes
**string** values.

### Default value

<!-- prettier-ignore-start -->

> [!NOTE]
> The `AUSTENITE_STRING` variable is sensitive, so the default value can't be shown.

<!-- prettier-ignore-end -->

### Example values

```sh
export AUSTENITE_STRING=conquistador # any value
```

```sh
export AUSTENITE_STRING='alabaster parakeet' # some values may need escaping
```

## `AUSTENITE_SVC_SERVICE_HOST`

_Kubernetes `austenite-svc` service host_

The `AUSTENITE_SVC_SERVICE_HOST` variable is an **optional** variable that takes
**hostname** values.

### Default value

<!-- prettier-ignore-start -->

> [!NOTE]
> The `AUSTENITE_SVC_SERVICE_HOST` variable is sensitive, so the default value can't be shown.

<!-- prettier-ignore-end -->

### Example values

```sh
export AUSTENITE_SVC_SERVICE_HOST=service.example.org # a hostname
```

```sh
export AUSTENITE_SVC_SERVICE_HOST=10.0.0.11 # an IP address
```

## `AUSTENITE_SVC_SERVICE_PORT`

_Kubernetes `austenite-svc` service port_

The `AUSTENITE_SVC_SERVICE_PORT` variable is an **optional** variable that takes
**port number** values.

### Default value

<!-- prettier-ignore-start -->

> [!NOTE]
> The `AUSTENITE_SVC_SERVICE_PORT` variable is sensitive, so the default value can't be shown.

<!-- prettier-ignore-end -->

### Example values

```sh
export AUSTENITE_SVC_SERVICE_PORT=12345 # a port number
```

## `AUSTENITE_URL`

_Example URL_

The `AUSTENITE_URL` variable is an **optional** variable that takes **absolute
URL** values.

### Default value

<!-- prettier-ignore-start -->

> [!NOTE]
> The `AUSTENITE_URL` variable is sensitive, so the default value can't be shown.

<!-- prettier-ignore-end -->

### Example values

```sh
export AUSTENITE_URL=https://host.example.org/path/to/resource # URL (absolute)
```

## `AUSTENITE_XTRIGGER`

_Trigger failure_

The `AUSTENITE_XTRIGGER` variable is a **required** variable that takes
**string** values.

### Example values

```sh
export AUSTENITE_XTRIGGER=conquistador # any value
```

```sh
export AUSTENITE_XTRIGGER='alabaster parakeet' # some values may need escaping
```
