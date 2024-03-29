# Environment variables

The `<app>` app uses **declarative environment variables** powered by **[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name                | Usage    | Description             |
| :------------------ | :------- | :---------------------- |
| [`WEIGHT`](#weight) | Optional | Weighting for this node |

<!-- prettier-ignore-start -->

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if that variable isn't set.

<!-- prettier-ignore-end -->

## `WEIGHT`

_Weighting for this node_

The `WEIGHT` variable is an **optional** variable that takes **number** values.

### Default value

```sh
export WEIGHT=100.001 # default
```

### Example values

```sh
export WEIGHT=123456 # integer
```

```sh
export WEIGHT=123.456 # positive
```

```sh
export WEIGHT=-123.456 # negative
```

```sh
export WEIGHT=1.23456e+2 # exponential
```

```sh
export WEIGHT=0x1e240 # hexadecimal
```

```sh
export WEIGHT=0o361100 # octal
```

```sh
export WEIGHT=0b11110001001000000 # binary
```
