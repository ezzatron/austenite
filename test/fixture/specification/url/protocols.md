# Environment variables

The `<app>` app uses **declarative environment variables** powered by **[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name                              | Usage    | Description                           |
| :-------------------------------- | :------- | :------------------------------------ |
| [`CDN_URL`](#cdn_url)             | Required | CDN to use when serving static assets |
| [`SOCKET_SERVER`](#socket_server) | Required | WebSocket server to use               |

<!-- prettier-ignore-start -->

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if that variable isn't set.

<!-- prettier-ignore-end -->

## `CDN_URL`

_CDN to use when serving static assets_

The `CDN_URL` variable is a **required** variable that takes **absolute URL** values, with these constraints:

- Protocol must be `https:`

### Example values

```sh
export CDN_URL=https://host.example.org/path/to/resource # URL (https:)
```

## `SOCKET_SERVER`

_WebSocket server to use_

The `SOCKET_SERVER` variable is a **required** variable that takes **absolute URL** values, with these constraints:

- Protocol must be `ws:` or `wss:`

### Example values

```sh
export SOCKET_SERVER=ws://host.example.org/path/to/resource # URL (ws:)
```

```sh
export SOCKET_SERVER=wss://host.example.org/path/to/resource # URL (wss:)
```
