# Environment variables

The `<app>` app uses **declarative environment variables** powered by
**[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name                                                        | Usage    | Description                             |
| :---------------------------------------------------------- | :------- | :-------------------------------------- |
| [`AUSTENITE_BINARY`](#AUSTENITE_BINARY)                     | Required | Example binary                          |
| [`AUSTENITE_BOOLEAN`](#AUSTENITE_BOOLEAN)                   | Required | Example boolean                         |
| [`AUSTENITE_DURATION`](#AUSTENITE_DURATION)                 | Required | Example duration                        |
| [`AUSTENITE_ENUMERATION`](#AUSTENITE_ENUMERATION)           | Required | Example enumeration                     |
| [`AUSTENITE_INTEGER`](#AUSTENITE_INTEGER)                   | Required | Example integer                         |
| [`AUSTENITE_INTEGER_BIG`](#AUSTENITE_INTEGER_BIG)           | Required | Example big integer                     |
| [`AUSTENITE_NUMBER`](#AUSTENITE_NUMBER)                     | Required | Example number                          |
| [`AUSTENITE_PORT_NUMBER`](#AUSTENITE_PORT_NUMBER)           | Required | Example port number                     |
| [`AUSTENITE_STRING`](#AUSTENITE_STRING)                     | Required | Example string                          |
| [`AUSTENITE_SVC_SERVICE_HOST`](#AUSTENITE_SVC_SERVICE_HOST) | Required | Kubernetes `austenite-svc` service host |
| [`AUSTENITE_SVC_SERVICE_PORT`](#AUSTENITE_SVC_SERVICE_PORT) | Required | Kubernetes `austenite-svc` service port |
| [`AUSTENITE_URL`](#AUSTENITE_URL)                           | Required | Example URL                             |

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if
> that variable isn't set.

## `AUSTENITE_BINARY`

_Example binary_

The `AUSTENITE_BINARY` variable is a **required** variable
that takes **base64** values.

### Example values

```sh
export AUSTENITE_BINARY=QmVlcCBib29wIQ== # <binary example A>
```

```sh
export AUSTENITE_BINARY=Qm9vcCBiZWVwIQ== # <binary example B>
```

## `AUSTENITE_BOOLEAN`

_Example boolean_

The `AUSTENITE_BOOLEAN` variable is a **required** variable
that takes `true` or `false`.

### Example values

```sh
export AUSTENITE_BOOLEAN=true # <boolean example A>
```

```sh
export AUSTENITE_BOOLEAN=false # <boolean example B>
```

## `AUSTENITE_DURATION`

_Example duration_

The `AUSTENITE_DURATION` variable is a **required** variable
that takes **ISO 8601 duration** values.

### Example values

```sh
export AUSTENITE_DURATION=PT10S # <duration example A>
```

```sh
export AUSTENITE_DURATION=PT20S # <duration example B>
```

## `AUSTENITE_ENUMERATION`

_Example enumeration_

The `AUSTENITE_ENUMERATION` variable is a **required** variable
that takes `foo`, `bar`, or `baz`.

### Example values

```sh
export AUSTENITE_ENUMERATION=foo # <enumeration example A>
```

```sh
export AUSTENITE_ENUMERATION=bar # <enumeration example B>
```

## `AUSTENITE_INTEGER`

_Example integer_

The `AUSTENITE_INTEGER` variable is a **required** variable
that takes **integer** values.

### Example values

```sh
export AUSTENITE_INTEGER=123456 # <integer example A>
```

```sh
export AUSTENITE_INTEGER=654321 # <integer example B>
```

## `AUSTENITE_INTEGER_BIG`

_Example big integer_

The `AUSTENITE_INTEGER_BIG` variable is a **required** variable
that takes **big integer** values.

### Example values

```sh
export AUSTENITE_INTEGER_BIG=12345678901234567890 # <bigInteger example A>
```

```sh
export AUSTENITE_INTEGER_BIG=98765432109876543210 # <bigInteger example B>
```

## `AUSTENITE_NUMBER`

_Example number_

The `AUSTENITE_NUMBER` variable is a **required** variable
that takes **number** values.

### Example values

```sh
export AUSTENITE_NUMBER=123.456 # <number example A>
```

```sh
export AUSTENITE_NUMBER=654.321 # <number example B>
```

## `AUSTENITE_PORT_NUMBER`

_Example port number_

The `AUSTENITE_PORT_NUMBER` variable is a **required** variable
that takes **port number** values.

### Example values

```sh
export AUSTENITE_PORT_NUMBER=123 # <port number example A>
```

```sh
export AUSTENITE_PORT_NUMBER=234 # <port number example B>
```

## `AUSTENITE_STRING`

_Example string_

The `AUSTENITE_STRING` variable is a **required** variable
that takes **string** values.

### Example values

```sh
export AUSTENITE_STRING='<value A>' # <string example A>
```

```sh
export AUSTENITE_STRING='<value B>' # <string example B>
```

## `AUSTENITE_SVC_SERVICE_HOST`

_Kubernetes `austenite-svc` service host_

The `AUSTENITE_SVC_SERVICE_HOST` variable is a **required** variable
that takes **hostname** values.

### Example values

```sh
export AUSTENITE_SVC_SERVICE_HOST=host.example.org # <k8s address host example A>
```

```sh
export AUSTENITE_SVC_SERVICE_HOST=host.example.com # <k8s address host example B>
```

## `AUSTENITE_SVC_SERVICE_PORT`

_Kubernetes `austenite-svc` service port_

The `AUSTENITE_SVC_SERVICE_PORT` variable is a **required** variable
that takes **port number** values.

### Example values

```sh
export AUSTENITE_SVC_SERVICE_PORT=321 # <k8s address port example A>
```

```sh
export AUSTENITE_SVC_SERVICE_PORT=432 # <k8s address port example B>
```

## `AUSTENITE_URL`

_Example URL_

The `AUSTENITE_URL` variable is a **required** variable
that takes **URL** values.
You can also use a URL reference relative to `https://example.com/path/to/`.

### Example values

```sh
export AUSTENITE_URL=https://example.org/path/to/resource # <URL example A>
```

```sh
export AUSTENITE_URL=resource # <URL example B>
```
