# Environment variables

The `<app>` app uses **declarative environment variables** powered by **[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name                      | Usage    | Description                     |
| :------------------------ | :------- | :------------------------------ |
| [`LOG_LEVEL`](#log_level) | Required | The minimum log level to record |

<!-- prettier-ignore-start -->

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if that variable isn't set.

<!-- prettier-ignore-end -->

## `LOG_LEVEL`

_The minimum log level to record_

The `LOG_LEVEL` variable is a **required** variable that takes `debug`, `info`, `warn`, `error`, or `fatal`.

### Example values

```sh
export LOG_LEVEL=debug # if you want lots of output
```

```sh
export LOG_LEVEL=error # if you only want to see when things go wrong
```
