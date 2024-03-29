# Environment variables

The `<app>` app uses **declarative environment variables** powered by **[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name                  | Usage    | Description                           |
| :-------------------- | :------- | :------------------------------------ |
| [`CDN_URL`](#cdn_url) | Optional | CDN to use when serving static assets |

<!-- prettier-ignore-start -->

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if that variable isn't set.

<!-- prettier-ignore-end -->

## `CDN_URL`

_CDN to use when serving static assets_

The `CDN_URL` variable is an **optional** variable that takes **absolute URL** values.

### Default value

```sh
export CDN_URL=https://default.example.org/path/to/resource # default
```

### Example values

```sh
export CDN_URL=https://host.example.org/path/to/resource # URL (absolute)
```
