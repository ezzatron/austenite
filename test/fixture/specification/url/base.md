# Environment variables

The `<app>` app uses **declarative environment variables** powered by
**[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name            | Usage    | Description     |
| :-------------- | :------- | :-------------- |
| [`LOGO`](#LOGO) | Required | Main logo image |

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if
> that variable isn't set.

## `LOGO`

_Main logo image_

The `LOGO` variable is a **required** variable
that takes **URL** values.

### Example values

```sh
export LOGO=https://host.example.org/path/to/resource # URL (absolute)
```

```sh
export LOGO=path/to/resource # URL (relative)
```
