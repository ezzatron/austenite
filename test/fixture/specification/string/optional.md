# Environment variables

The `<app>` app uses **declarative environment variables** powered by **[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name                    | Usage    | Description                                |
| :---------------------- | :------- | :----------------------------------------- |
| [`READ_DSN`](#read_dsn) | Optional | Database connection string for read-models |

<!-- prettier-ignore-start -->

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if that variable isn't set.

<!-- prettier-ignore-end -->

## `READ_DSN`

_Database connection string for read-models_

The `READ_DSN` variable is an **optional** variable that takes **string** values.

### Example values

```sh
export READ_DSN=conquistador # any value
```

```sh
export READ_DSN='alabaster parakeet' # some values may need escaping
```
