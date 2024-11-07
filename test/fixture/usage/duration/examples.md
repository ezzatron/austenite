# Environment variables

The `<app>` app uses **declarative environment variables** powered by
**[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name                            | Usage    | Description          |
| :------------------------------ | :------- | :------------------- |
| [`GRPC_TIMEOUT`](#grpc_timeout) | Required | GRPC request timeout |

<!-- prettier-ignore-start -->

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if that variable isn't set.

<!-- prettier-ignore-end -->

## `GRPC_TIMEOUT`

_GRPC request timeout_

The `GRPC_TIMEOUT` variable is a **required** variable that takes **ISO 8601
duration** values.

### Example values

```sh
export GRPC_TIMEOUT=PT0.1S # 100 milliseconds
```

```sh
export GRPC_TIMEOUT=P0DT5S # 5 seconds
```
