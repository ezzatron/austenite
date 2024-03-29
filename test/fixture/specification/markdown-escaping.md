# Environment variables

The `<app>` app uses **declarative environment variables** powered by
**[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name                                    | Usage    | Description                                          |
| :-------------------------------------- | :------- | :--------------------------------------------------- |
| [`AUSTENITE_STRING`](#austenite_string) | Required | ## \[Not a heading]\(https\://malicious.example.org) |

<!-- prettier-ignore-start -->

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if that variable isn't set.

<!-- prettier-ignore-end -->

## `AUSTENITE_STRING`

_## \[Not a heading]\(https\://malicious.example.org)_

The `AUSTENITE_STRING` variable is a **required** variable that takes **string**
values.

### Example values

```sh
export AUSTENITE_STRING=conquistador # any value
```

```sh
export AUSTENITE_STRING='alabaster parakeet' # some values may need escaping
```
