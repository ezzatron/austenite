# Environment variables

The `<app>` app uses **declarative environment variables** powered by
**[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name              | Usage    | Description                          |
| :---------------- | :------- | :----------------------------------- |
| [`DEBUG`](#DEBUG) | Optional | Enable or disable debugging features |

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if
> that variable isn't set.

## `DEBUG`

_Enable or disable debugging features_

The `DEBUG` variable is an **optional** variable
that takes `true` or `false`.

### Example values

```sh
export DEBUG=true # true
```

```sh
export DEBUG=false # false
```
