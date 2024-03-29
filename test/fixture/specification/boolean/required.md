# Environment variables

The `<app>` app uses **declarative environment variables** powered by **[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name              | Usage    | Description                          |
| :---------------- | :------- | :----------------------------------- |
| [`DEBUG`](#debug) | Required | Enable or disable debugging features |

<!-- prettier-ignore-start -->

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if that variable isn't set.

<!-- prettier-ignore-end -->

## `DEBUG`

_Enable or disable debugging features_

The `DEBUG` variable is a **required** variable that takes `true` or `false`.

### Example values

```sh
export DEBUG=true # true
```

```sh
export DEBUG=false # false
```
