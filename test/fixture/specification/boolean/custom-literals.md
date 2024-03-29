# Environment variables

The `<app>` app uses **declarative environment variables** powered by
**[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name              | Usage    | Description                          |
| :---------------- | :------- | :----------------------------------- |
| [`DEBUG`](#debug) | Optional | Enable or disable debugging features |

<!-- prettier-ignore-start -->

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if that variable isn't set.

<!-- prettier-ignore-end -->

## `DEBUG`

_Enable or disable debugging features_

The `DEBUG` variable is an **optional** variable that takes `y`, `yes`, `n`, or
`no`.

### Default value

```sh
export DEBUG=n # default
```

### Example values

```sh
export DEBUG=y # true
```

```sh
export DEBUG=yes # true
```

```sh
export DEBUG=n # false
```

```sh
export DEBUG=no # false
```
