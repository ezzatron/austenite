# Environment variables

The `<app>` app uses **declarative environment variables** powered by
**[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name                              | Usage    | Description                           |
| :-------------------------------- | :------- | :------------------------------------ |
| [`CDN_URL`](#CDN_URL)             | Required | CDN to use when serving static assets |
| [`SOCKET_SERVER`](#SOCKET_SERVER) | Required | WebSocket server to use               |

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if
> that variable isn't set.

## `CDN_URL`

_CDN to use when serving static assets_

The `CDN_URL` variable is a **required** variable
that takes **URL** values with these constraints:

- Protocol must be https:

### Example values

> [!WARNING]
> These generated examples may not follow the constraints applied to
> `CDN_URL`.

```sh
export CDN_URL=https://host.example.org/path/to/resource # URL (https:)
```

## `SOCKET_SERVER`

_WebSocket server to use_

The `SOCKET_SERVER` variable is a **required** variable
that takes **URL** values with these constraints:

- Protocol must be ws: or wss:

### Example values

> [!WARNING]
> These generated examples may not follow the constraints applied to
> `SOCKET_SERVER`.

```sh
export SOCKET_SERVER=ws://host.example.org/path/to/resource # URL (ws:)
```

```sh
export SOCKET_SERVER=wss://host.example.org/path/to/resource # URL (wss:)
```
