# Environment variables

The `<app>` app uses **declarative environment variables** powered by
**[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name            | Usage    | Description                     |
| :-------------- | :------- | :------------------------------ |
| [`PORT`](#port) | Required | Listen port for the HTTP server |

<!-- prettier-ignore-start -->

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if that variable isn't set.

<!-- prettier-ignore-end -->

## `PORT`

_Listen port for the HTTP server_

The `PORT` variable is a **required** variable that takes **port number**
values.

### Example values

```sh
export PORT=80 # standard web
```

```sh
export PORT=50080 # ephemeral
```
