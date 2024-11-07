<BEGIN>
# Environment variables

The `<app>` app uses **declarative environment variables** powered by **[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name            | Usage    | Description     |
| :-------------- | :------- | :-------------- |
| [`LOGO`](#logo) | Required | Main logo image |

<!-- prettier-ignore-start -->

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if that variable isn't set.

<!-- prettier-ignore-end -->

## `LOGO`

_Main logo image_

The `LOGO` variable is a **required** variable that takes **absolute URL** values, or **relative URL** values relative to `https://base.example.org/path/to/resource`.

### Example values

```sh
export LOGO=https://host.example.org/path/to/resource # URL (absolute)
```

```sh
export LOGO=path/to/resource # URL (relative)
```

<END>
