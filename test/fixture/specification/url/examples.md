# Environment variables

The `<app>` app uses **declarative environment variables** powered by
**[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name                  | Usage    | Description                           |
| :-------------------- | :------- | :------------------------------------ |
| [`CDN_URL`](#CDN_URL) | Required | CDN to use when serving static assets |

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if
> that variable isn't set.

## `CDN_URL`

_CDN to use when serving static assets_

The `CDN_URL` variable is a **required** variable
that takes **URL** values.
You can also use a URL reference relative to `https://host.example.org/path/to/`.

### Example values

```sh
export CDN_URL=https://host.example.org/path/to/resource # absolute
```

```sh
export CDN_URL=resource # relative
```
