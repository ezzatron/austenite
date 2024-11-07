# Environment variables

The `<app>` app uses **declarative environment variables** powered by
**[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name                  | Usage    | Description       |
| :-------------------- | :------- | :---------------- |
| [`MESSAGE`](#message) | Optional | Message to output |

<!-- prettier-ignore-start -->

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if that variable isn't set.

<!-- prettier-ignore-end -->

## `MESSAGE`

_Message to output_

The `MESSAGE` variable is an **optional** variable that takes **string** values.

### Default value

```sh
export MESSAGE='Season'"'"'s greetings, world!' # default
```

### Example values

```sh
export MESSAGE=conquistador # any value
```

```sh
export MESSAGE='alabaster parakeet' # some values may need escaping
```
