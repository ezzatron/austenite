# Environment variables

The `<app>` app uses **declarative environment variables** powered by
**[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name                | Usage    | Description             |
| :------------------ | :------- | :---------------------- |
| [`WEIGHT`](#WEIGHT) | Required | Weighting for this node |

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if
> that variable isn't set.

## `WEIGHT`

_Weighting for this node_

The `WEIGHT` variable is a **required** variable
that takes **number** values.

### Example values

```sh
export WEIGHT=0.01 # 1%
```

```sh
export WEIGHT=2.5e-1 # 25%
```
