# Environment variables

The `<app>` app uses **declarative environment variables** powered by
**[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name                | Usage    | Description             |
| :------------------ | :------- | :---------------------- |
| [`WEIGHT`](#WEIGHT) | Optional | Weighting for this node |

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if
> that variable isn't set.

## `WEIGHT`

_Weighting for this node_

The `WEIGHT` variable is an **optional** variable
that takes **integer** values.

### Example values

```sh
export WEIGHT=123456 # positive
```

```sh
export WEIGHT=-123456 # negative
```

```sh
export WEIGHT=1.23456e+5 # exponential
```

```sh
export WEIGHT=0x1E240 # hexadecimal
```

```sh
export WEIGHT=0o361100 # octal
```

```sh
export WEIGHT=0b11110001001000000 # binary
```
