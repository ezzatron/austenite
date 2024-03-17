# Environment variables

The `<app>` app uses **declarative environment variables** powered by
**[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name                                                              | Usage    | Description                                   |
| :---------------------------------------------------------------- | :------- | :-------------------------------------------- |
| [`AUSTENITE_BINARY_LENGTH`](#AUSTENITE_BINARY_LENGTH)             | Required | Example binary with length constraint         |
| [`AUSTENITE_BINARY_LENGTH_RANGE`](#AUSTENITE_BINARY_LENGTH_RANGE) | Required | Example binary with length range constraint   |
| [`AUSTENITE_BINARY_MAX_LENGTH`](#AUSTENITE_BINARY_MAX_LENGTH)     | Required | Example binary with maximum length constraint |
| [`AUSTENITE_BINARY_MIN_LENGTH`](#AUSTENITE_BINARY_MIN_LENGTH)     | Required | Example binary with minimum length constraint |
| [`AUSTENITE_STRING_LENGTH`](#AUSTENITE_STRING_LENGTH)             | Required | Example string with length constraint         |
| [`AUSTENITE_STRING_LENGTH_RANGE`](#AUSTENITE_STRING_LENGTH_RANGE) | Required | Example string with length range constraint   |
| [`AUSTENITE_STRING_MAX_LENGTH`](#AUSTENITE_STRING_MAX_LENGTH)     | Required | Example string with maximum length constraint |
| [`AUSTENITE_STRING_MIN_LENGTH`](#AUSTENITE_STRING_MIN_LENGTH)     | Required | Example string with minimum length constraint |

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if
> that variable isn't set.

## `AUSTENITE_BINARY_LENGTH`

_Example binary with length constraint_

The `AUSTENITE_BINARY_LENGTH` variable is a **required** variable
that takes **base64** values with these constraints:

- Must have a decoded length of 1

### Example values

> [!WARNING]
> These generated examples may not follow the constraints applied to
> `AUSTENITE_BINARY_LENGTH`.

```sh
export AUSTENITE_BINARY_LENGTH=Y29ucXVpc3RhZG9y # base64 encoded string
```

## `AUSTENITE_BINARY_LENGTH_RANGE`

_Example binary with length range constraint_

The `AUSTENITE_BINARY_LENGTH_RANGE` variable is a **required** variable
that takes **base64** values with these constraints:

- Must have a decoded length between 4 and 5

### Example values

> [!WARNING]
> These generated examples may not follow the constraints applied to
> `AUSTENITE_BINARY_LENGTH_RANGE`.

```sh
export AUSTENITE_BINARY_LENGTH_RANGE=Y29ucXVpc3RhZG9y # base64 encoded string
```

## `AUSTENITE_BINARY_MAX_LENGTH`

_Example binary with maximum length constraint_

The `AUSTENITE_BINARY_MAX_LENGTH` variable is a **required** variable
that takes **base64** values with these constraints:

- Must have a maximum decoded length of 3

### Example values

> [!WARNING]
> These generated examples may not follow the constraints applied to
> `AUSTENITE_BINARY_MAX_LENGTH`.

```sh
export AUSTENITE_BINARY_MAX_LENGTH=Y29ucXVpc3RhZG9y # base64 encoded string
```

## `AUSTENITE_BINARY_MIN_LENGTH`

_Example binary with minimum length constraint_

The `AUSTENITE_BINARY_MIN_LENGTH` variable is a **required** variable
that takes **base64** values with these constraints:

- Must have a minimum decoded length of 2

### Example values

> [!WARNING]
> These generated examples may not follow the constraints applied to
> `AUSTENITE_BINARY_MIN_LENGTH`.

```sh
export AUSTENITE_BINARY_MIN_LENGTH=Y29ucXVpc3RhZG9y # base64 encoded string
```

## `AUSTENITE_STRING_LENGTH`

_Example string with length constraint_

The `AUSTENITE_STRING_LENGTH` variable is a **required** variable
that takes **string** values with these constraints:

- Must have a length of 1

### Example values

> [!WARNING]
> These generated examples may not follow the constraints applied to
> `AUSTENITE_STRING_LENGTH`.

```sh
export AUSTENITE_STRING_LENGTH=conquistador # any value
```

```sh
export AUSTENITE_STRING_LENGTH='alabaster parakeet' # some values may need escaping
```

## `AUSTENITE_STRING_LENGTH_RANGE`

_Example string with length range constraint_

The `AUSTENITE_STRING_LENGTH_RANGE` variable is a **required** variable
that takes **string** values with these constraints:

- Must have a length between 4 and 5

### Example values

> [!WARNING]
> These generated examples may not follow the constraints applied to
> `AUSTENITE_STRING_LENGTH_RANGE`.

```sh
export AUSTENITE_STRING_LENGTH_RANGE=conquistador # any value
```

```sh
export AUSTENITE_STRING_LENGTH_RANGE='alabaster parakeet' # some values may need escaping
```

## `AUSTENITE_STRING_MAX_LENGTH`

_Example string with maximum length constraint_

The `AUSTENITE_STRING_MAX_LENGTH` variable is a **required** variable
that takes **string** values with these constraints:

- Must have a maximum length of 3

### Example values

> [!WARNING]
> These generated examples may not follow the constraints applied to
> `AUSTENITE_STRING_MAX_LENGTH`.

```sh
export AUSTENITE_STRING_MAX_LENGTH=conquistador # any value
```

```sh
export AUSTENITE_STRING_MAX_LENGTH='alabaster parakeet' # some values may need escaping
```

## `AUSTENITE_STRING_MIN_LENGTH`

_Example string with minimum length constraint_

The `AUSTENITE_STRING_MIN_LENGTH` variable is a **required** variable
that takes **string** values with these constraints:

- Must have a minimum length of 2

### Example values

> [!WARNING]
> These generated examples may not follow the constraints applied to
> `AUSTENITE_STRING_MIN_LENGTH`.

```sh
export AUSTENITE_STRING_MIN_LENGTH=conquistador # any value
```

```sh
export AUSTENITE_STRING_MIN_LENGTH='alabaster parakeet' # some values may need escaping
```
