# Environment variables

The `<app>` app uses **declarative environment variables** powered by
**[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name                            | Usage    | Description          |
| :------------------------------ | :------- | :------------------- |
| [`GRPC_TIMEOUT`](#GRPC_TIMEOUT) | Optional | GRPC request timeout |

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if
> that variable isn't set.

## `GRPC_TIMEOUT`

_GRPC request timeout_

The `GRPC_TIMEOUT` variable is an **optional** variable
that takes **ISO 8601 duration** values.

### Default value

```sh
export GRPC_TIMEOUT=PT0.01S # default
```

### Example values

```sh
export GRPC_TIMEOUT=PT1M30S # ISO 8601 duration
```

```sh
export GRPC_TIMEOUT=P1M15DT12H # ISO 8601 duration
```
