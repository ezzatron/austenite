# Environment variables

The `<app>` app uses **declarative environment variables** powered by **[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name                      | Usage    | Description                     |
| :------------------------ | :------- | :------------------------------ |
| [`LOG_LEVEL`](#log_level) | Optional | The minimum log level to record |

<!-- prettier-ignore-start -->

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if that variable isn't set.

<!-- prettier-ignore-end -->

## `LOG_LEVEL`

_The minimum log level to record_

The `LOG_LEVEL` variable is an **optional** variable that takes `debug`, `info`, `warn`, `error`, or `fatal`.

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
