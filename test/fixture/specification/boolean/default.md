# Environment variables

The `<app>` app uses **declarative environment variables** powered by **[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name                        | Usage    | Description                          |
| :-------------------------- | :------- | :----------------------------------- |
| [`DEBUG`](#debug)           | Optional | Enable or disable debugging features |
| [`PRODUCTION`](#production) | Optional | Enable or disable production mode    |

<!-- prettier-ignore-start -->

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if that variable isn't set.

<!-- prettier-ignore-end -->

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

## `PRODUCTION`

_Enable or disable production mode_

The `PRODUCTION` variable is an **optional** variable that takes `true` or `false`.

### Default value

```sh
export PRODUCTION=true # default
```

### Example values

```sh
export PRODUCTION=true # true
```

```sh
export PRODUCTION=false # false
```
