# Environment variables

The `<app>` app uses **declarative environment variables** powered by
**[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name                  | Usage    | Description                           |
| :-------------------- | :------- | :------------------------------------ |
| [`CDN_URL`](#cdn_url) | Required | CDN to use when serving static assets |

<!-- prettier-ignore-start -->

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if that variable isn't set.

<!-- prettier-ignore-end -->

## `CDN_URL`

_CDN to use when serving static assets_

The `CDN_URL` variable is a **required** variable that takes **absolute URL**
values, or **relative URL** values relative to
`https://host.example.org/path/to/`.

### Example values

```sh
export CDN_URL=https://host.example.org/path/to/resource # absolute
```

```sh
export CDN_URL=resource # relative
```
