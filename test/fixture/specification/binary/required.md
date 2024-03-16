# Environment variables

The `<app>` app uses **declarative environment variables** powered by
**[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name                          | Usage    | Description               |
| :---------------------------- | :------- | :------------------------ |
| [`SESSION_KEY`](#SESSION_KEY) | Required | Session token signing key |

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if
> that variable isn't set.

## `SESSION_KEY`

_Session token signing key_

The `SESSION_KEY` variable is a **required** variable
that takes **base64** values.

### Example values

```sh
export SESSION_KEY=Y29ucXVpc3RhZG9y # base64 encoded string
```
