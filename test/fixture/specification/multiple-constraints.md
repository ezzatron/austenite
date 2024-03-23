# Environment variables

The `<app>` app uses **declarative environment variables** powered by
**[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name                                    | Usage    | Description     |
| :-------------------------------------- | :------- | :-------------- |
| [`AUSTENITE_CUSTOM`](#AUSTENITE_CUSTOM) | Required | Custom variable |

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if
> that variable isn't set.

## `AUSTENITE_CUSTOM`

_Custom variable_

The `AUSTENITE_CUSTOM` variable is a **required** variable
that takes **string** values with these constraints:

- Must start with a greeting
- Must end with a subject
