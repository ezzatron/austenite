# Environment variables

The `<app>` app uses **declarative environment variables** powered by
**[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name                          | Usage    | Description               |
| :---------------------------- | :------- | :------------------------ |
| [`SESSION_KEY`](#session_key) | Optional | Session token signing key |

<!-- prettier-ignore-start -->

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if that variable isn't set.

<!-- prettier-ignore-end -->

## `SESSION_KEY`

_Session token signing key_

The `SESSION_KEY` variable is an **optional** variable that takes **base64**
values.

### Default value

```sh
export SESSION_KEY=XY7l3m0bmuzX5IAu6/KUyPRQXKc8H1LjAl2Q897vbYw= # default
```

### Example values

```sh
export SESSION_KEY=Y29ucXVpc3RhZG9y # base64 encoded string
```
