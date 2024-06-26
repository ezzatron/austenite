# Environment variables

The `example` app uses **declarative environment variables** powered by
**[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name                                                        | Usage    | Description                                |
| :---------------------------------------------------------- | :------- | :----------------------------------------- |
| [`CDN_URL`](#cdn_url)                                       | Required | CDN to use when serving static assets      |
| [`DEBUG`](#debug)                                           | Optional | Enable or disable debugging features       |
| [`EARTH_ATOM_COUNT`](#earth_atom_count)                     | Optional | Number of atoms on earth                   |
| [`GRPC_TIMEOUT`](#grpc_timeout)                             | Optional | GRPC request timeout                       |
| [`LOG_LEVEL`](#log_level)                                   | Optional | The minimum log level to record            |
| [`PORT`](#port)                                             | Optional | Listen port for the HTTP server            |
| [`READ_DSN`](#read_dsn)                                     | Required | Database connection string for read-models |
| [`REDIS_PRIMARY_SERVICE_HOST`](#redis_primary_service_host) | Required | Kubernetes `redis-primary` service host    |
| [`REDIS_PRIMARY_SERVICE_PORT`](#redis_primary_service_port) | Required | Kubernetes `redis-primary` service port    |
| [`SAMPLE_RATIO`](#sample_ratio)                             | Optional | Ratio of requests to sample                |
| [`SESSION_KEY`](#session_key)                               | Required | Session token signing key                  |
| [`WEIGHT`](#weight)                                         | Required | Weighting for this node                    |

<!-- prettier-ignore-start -->

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if that variable isn't set.

<!-- prettier-ignore-end -->

## `CDN_URL`

_CDN to use when serving static assets_

The `CDN_URL` variable is a **required** variable that takes **absolute URL**
values, with these constraints:

- Protocol must be `http:` or `https:`

### Example values

```sh
export CDN_URL=http://host.example.org/path/to/resource # URL (http:)
```

```sh
export CDN_URL=https://host.example.org/path/to/resource # URL (https:)
```

## `DEBUG`

_Enable or disable debugging features_

The `DEBUG` variable is an **optional** variable that takes `true` or `false`.

### Default value

```sh
export DEBUG=false # default
```

### Example values

```sh
export DEBUG=true # true
```

```sh
export DEBUG=false # false
```

## `EARTH_ATOM_COUNT`

_Number of atoms on earth_

The `EARTH_ATOM_COUNT` variable is an **optional** variable that takes **big
integer** values.

### Example values

```sh
export EARTH_ATOM_COUNT=123456 # positive
```

```sh
export EARTH_ATOM_COUNT=-123456 # negative
```

```sh
export EARTH_ATOM_COUNT=0x1e240 # hexadecimal
```

```sh
export EARTH_ATOM_COUNT=0o361100 # octal
```

```sh
export EARTH_ATOM_COUNT=0b11110001001000000 # binary
```

## `GRPC_TIMEOUT`

_GRPC request timeout_

The `GRPC_TIMEOUT` variable is an **optional** variable that takes **ISO 8601
duration** values, with these constraints:

- Must be >= PT0.1S and <= PT10S

### Example values

```sh
export GRPC_TIMEOUT=PT0.3S # 300 milliseconds
```

```sh
export GRPC_TIMEOUT=PT5S # 5 seconds
```

## `LOG_LEVEL`

_The minimum log level to record_

The `LOG_LEVEL` variable is an **optional** variable that takes `debug`, `info`,
`warn`, `error`, or `fatal`.

### Default value

```sh
export LOG_LEVEL=info # default
```

### Example values

```sh
export LOG_LEVEL=debug # show information for developers
```

```sh
export LOG_LEVEL=info # standard log messages
```

```sh
export LOG_LEVEL=warn # important, but don't need individual human review
```

```sh
export LOG_LEVEL=error # a healthy application shouldn't produce any errors
```

```sh
export LOG_LEVEL=fatal # the application cannot proceed
```

## `PORT`

_Listen port for the HTTP server_

The `PORT` variable is an **optional** variable that takes **port number**
values.

### Default value

```sh
export PORT=8080 # default
```

### Example values

```sh
export PORT=12345 # a port number
```

## `READ_DSN`

_Database connection string for read-models_

The `READ_DSN` variable is a **required** variable that takes **string** values,
with these constraints:

- Must have a minimum length of 30

### Example values

```sh
export READ_DSN='host=localhost dbname=readmodels user=projector' # local database
```

## `REDIS_PRIMARY_SERVICE_HOST`

_Kubernetes `redis-primary` service host_

The `REDIS_PRIMARY_SERVICE_HOST` variable is a **required** variable that takes
**hostname** values.

### Example values

```sh
export REDIS_PRIMARY_SERVICE_HOST=service.example.org # a hostname
```

```sh
export REDIS_PRIMARY_SERVICE_HOST=10.0.0.11 # an IP address
```

## `REDIS_PRIMARY_SERVICE_PORT`

_Kubernetes `redis-primary` service port_

The `REDIS_PRIMARY_SERVICE_PORT` variable is a **required** variable that takes
**port number** values.

### Example values

```sh
export REDIS_PRIMARY_SERVICE_PORT=12345 # a port number
```

## `SAMPLE_RATIO`

_Ratio of requests to sample_

The `SAMPLE_RATIO` variable is an **optional** variable that takes **number**
values.

### Example values

```sh
export SAMPLE_RATIO=123456 # integer
```

```sh
export SAMPLE_RATIO=123.456 # positive
```

```sh
export SAMPLE_RATIO=-123.456 # negative
```

```sh
export SAMPLE_RATIO=1.23456e+2 # exponential
```

```sh
export SAMPLE_RATIO=0x1e240 # hexadecimal
```

```sh
export SAMPLE_RATIO=0o361100 # octal
```

```sh
export SAMPLE_RATIO=0b11110001001000000 # binary
```

## `SESSION_KEY`

_Session token signing key_

The `SESSION_KEY` variable is a **required** variable that takes **base64**
values.

### Example values

```sh
export SESSION_KEY=Y29ucXVpc3RhZG9y # base64 encoded string
```

## `WEIGHT`

_Weighting for this node_

The `WEIGHT` variable is a **required** variable that takes **integer** values,
with these constraints:

- Must be >= 1

### Example values

```sh
export WEIGHT=1 # lowest
```

```sh
export WEIGHT=100 # high
```

```sh
export WEIGHT=1000 # very high
```
