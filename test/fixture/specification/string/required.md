# Environment variables

The `<app>` app uses **declarative environment variables** powered by
**[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name                    | Usage    | Description                                |
| :---------------------- | :------- | :----------------------------------------- |
| [`READ_DSN`](#READ_DSN) | Required | Database connection string for read-models |

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if
> that variable isn't set.

## `READ_DSN`

_Database connection string for read-models_

The `READ_DSN` variable is a **required** variable
that takes **string** values.

### Example values

```sh
export READ_DSN=conquistador # any value
```

```sh
export READ_DSN='alabaster parakeet' # some values may need escaping
```
