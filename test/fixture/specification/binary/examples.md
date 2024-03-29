# Environment variables

The `<app>` app uses **declarative environment variables** powered by **[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name                          | Usage    | Description               |
| :---------------------------- | :------- | :------------------------ |
| [`SESSION_KEY`](#session_key) | Required | Session token signing key |

<!-- prettier-ignore-start -->

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if that variable isn't set.

<!-- prettier-ignore-end -->

## `SESSION_KEY`

_Session token signing key_

The `SESSION_KEY` variable is a **required** variable that takes **base64** values.

### Example values

```sh
export SESSION_KEY=MTI4X0JJVF9TSUdOX0tFWQ== # 128-bit key
```

```sh
export SESSION_KEY=U1VQRVJfU0VDUkVUXzI1Nl9CSVRfU0lHTklOR19LRVk # 256-bit key
```
