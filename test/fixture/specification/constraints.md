# Environment variables

The `<app>` app uses **declarative environment variables** powered by
**[Austenite]**.

[austenite]: https://github.com/ezzatron/austenite

| Name                                                                | Usage    | Description                                      |
| :------------------------------------------------------------------ | :------- | :----------------------------------------------- |
| [`AUSTENITE_BINARY_LENGTH`](#AUSTENITE_BINARY_LENGTH)               | Required | Example binary with length constraint            |
| [`AUSTENITE_BINARY_LENGTH_RANGE`](#AUSTENITE_BINARY_LENGTH_RANGE)   | Required | Example binary with length range constraint      |
| [`AUSTENITE_BINARY_MAX_LENGTH`](#AUSTENITE_BINARY_MAX_LENGTH)       | Required | Example binary with maximum length constraint    |
| [`AUSTENITE_BINARY_MIN_LENGTH`](#AUSTENITE_BINARY_MIN_LENGTH)       | Required | Example binary with minimum length constraint    |
| [`AUSTENITE_CUSTOM`](#AUSTENITE_CUSTOM)                             | Required | Custom variable                                  |
| [`AUSTENITE_DURATION_MAX`](#AUSTENITE_DURATION_MAX)                 | Required | Example duration with maximum constraint         |
| [`AUSTENITE_DURATION_MIN`](#AUSTENITE_DURATION_MIN)                 | Required | Example duration with minimum constraint         |
| [`AUSTENITE_DURATION_RANGE`](#AUSTENITE_DURATION_RANGE)             | Required | Example duration with range constraint           |
| [`AUSTENITE_INTEGER_BIG_MAX`](#AUSTENITE_INTEGER_BIG_MAX)           | Required | Example big integer with maximum constraint      |
| [`AUSTENITE_INTEGER_BIG_MIN`](#AUSTENITE_INTEGER_BIG_MIN)           | Required | Example big integer with minimum constraint      |
| [`AUSTENITE_INTEGER_BIG_RANGE`](#AUSTENITE_INTEGER_BIG_RANGE)       | Required | Example big integer with range constraint        |
| [`AUSTENITE_INTEGER_MAX`](#AUSTENITE_INTEGER_MAX)                   | Required | Example integer with maximum constraint          |
| [`AUSTENITE_INTEGER_MIN`](#AUSTENITE_INTEGER_MIN)                   | Required | Example integer with minimum constraint          |
| [`AUSTENITE_INTEGER_RANGE`](#AUSTENITE_INTEGER_RANGE)               | Required | Example integer with range constraint            |
| [`AUSTENITE_NUMBER_MAX`](#AUSTENITE_NUMBER_MAX)                     | Required | Example number with inclusive maximum constraint |
| [`AUSTENITE_NUMBER_MAX_EXCLUSIVE`](#AUSTENITE_NUMBER_MAX_EXCLUSIVE) | Required | Example number with exclusive maximum constraint |
| [`AUSTENITE_NUMBER_MIN`](#AUSTENITE_NUMBER_MIN)                     | Required | Example number with inclusive minimum constraint |
| [`AUSTENITE_NUMBER_MIN_EXCLUSIVE`](#AUSTENITE_NUMBER_MIN_EXCLUSIVE) | Required | Example number with exclusive minimum constraint |
| [`AUSTENITE_NUMBER_RANGE`](#AUSTENITE_NUMBER_RANGE)                 | Required | Example number with range constraint             |
| [`AUSTENITE_PORT_NUMBER_MAX`](#AUSTENITE_PORT_NUMBER_MAX)           | Required | Example port number with maximum constraint      |
| [`AUSTENITE_PORT_NUMBER_MIN`](#AUSTENITE_PORT_NUMBER_MIN)           | Required | Example port number with minimum constraint      |
| [`AUSTENITE_PORT_NUMBER_RANGE`](#AUSTENITE_PORT_NUMBER_RANGE)       | Required | Example port number with range constraint        |
| [`AUSTENITE_STRING_LENGTH`](#AUSTENITE_STRING_LENGTH)               | Required | Example string with length constraint            |
| [`AUSTENITE_STRING_LENGTH_RANGE`](#AUSTENITE_STRING_LENGTH_RANGE)   | Required | Example string with length range constraint      |
| [`AUSTENITE_STRING_MAX_LENGTH`](#AUSTENITE_STRING_MAX_LENGTH)       | Required | Example string with maximum length constraint    |
| [`AUSTENITE_STRING_MIN_LENGTH`](#AUSTENITE_STRING_MIN_LENGTH)       | Required | Example string with minimum length constraint    |

> [!TIP]
> If you set an empty value for an environment variable, the app behaves as if
> that variable isn't set.

## `AUSTENITE_BINARY_LENGTH`

_Example binary with length constraint_

The `AUSTENITE_BINARY_LENGTH` variable is a **required** variable
that takes **base64** values with these constraints:

- Must have a decoded length of 1

### Example values

```sh
export AUSTENITE_BINARY_LENGTH=YQ== # example
```

## `AUSTENITE_BINARY_LENGTH_RANGE`

_Example binary with length range constraint_

The `AUSTENITE_BINARY_LENGTH_RANGE` variable is a **required** variable
that takes **base64** values with these constraints:

- Must have a decoded length between 4 and 5

### Example values

```sh
export AUSTENITE_BINARY_LENGTH_RANGE=YWJjZA== # example
```

## `AUSTENITE_BINARY_MAX_LENGTH`

_Example binary with maximum length constraint_

The `AUSTENITE_BINARY_MAX_LENGTH` variable is a **required** variable
that takes **base64** values with these constraints:

- Must have a maximum decoded length of 3

### Example values

```sh
export AUSTENITE_BINARY_MAX_LENGTH=YWJj # example
```

## `AUSTENITE_BINARY_MIN_LENGTH`

_Example binary with minimum length constraint_

The `AUSTENITE_BINARY_MIN_LENGTH` variable is a **required** variable
that takes **base64** values with these constraints:

- Must have a minimum decoded length of 2

### Example values

```sh
export AUSTENITE_BINARY_MIN_LENGTH=YWI= # example
```

## `AUSTENITE_CUSTOM`

_Custom variable_

The `AUSTENITE_CUSTOM` variable is a **required** variable
that takes **string** values with these constraints:

- Must start with a greeting
- Must end with a subject

### Example values

```sh
export AUSTENITE_CUSTOM='Hello, world!' # example
```

## `AUSTENITE_DURATION_MAX`

_Example duration with maximum constraint_

The `AUSTENITE_DURATION_MAX` variable is a **required** variable
that takes **ISO 8601 duration** values with these constraints:

- Must be <= PT2S

### Example values

```sh
export AUSTENITE_DURATION_MAX=PT2S # example
```

## `AUSTENITE_DURATION_MIN`

_Example duration with minimum constraint_

The `AUSTENITE_DURATION_MIN` variable is a **required** variable
that takes **ISO 8601 duration** values with these constraints:

- Must be >= PT1S

### Example values

```sh
export AUSTENITE_DURATION_MIN=PT1S # example
```

## `AUSTENITE_DURATION_RANGE`

_Example duration with range constraint_

The `AUSTENITE_DURATION_RANGE` variable is a **required** variable
that takes **ISO 8601 duration** values with these constraints:

- Must be >= PT3S and <= PT4S

### Example values

```sh
export AUSTENITE_DURATION_RANGE=PT3S # example
```

## `AUSTENITE_INTEGER_BIG_MAX`

_Example big integer with maximum constraint_

The `AUSTENITE_INTEGER_BIG_MAX` variable is a **required** variable
that takes **big integer** values with these constraints:

- Must be <= 2

### Example values

```sh
export AUSTENITE_INTEGER_BIG_MAX=2 # example
```

## `AUSTENITE_INTEGER_BIG_MIN`

_Example big integer with minimum constraint_

The `AUSTENITE_INTEGER_BIG_MIN` variable is a **required** variable
that takes **big integer** values with these constraints:

- Must be >= 1

### Example values

```sh
export AUSTENITE_INTEGER_BIG_MIN=1 # example
```

## `AUSTENITE_INTEGER_BIG_RANGE`

_Example big integer with range constraint_

The `AUSTENITE_INTEGER_BIG_RANGE` variable is a **required** variable
that takes **big integer** values with these constraints:

- Must be >= 3 and <= 4

### Example values

```sh
export AUSTENITE_INTEGER_BIG_RANGE=3 # example
```

## `AUSTENITE_INTEGER_MAX`

_Example integer with maximum constraint_

The `AUSTENITE_INTEGER_MAX` variable is a **required** variable
that takes **integer** values with these constraints:

- Must be <= 2

### Example values

```sh
export AUSTENITE_INTEGER_MAX=2 # example
```

## `AUSTENITE_INTEGER_MIN`

_Example integer with minimum constraint_

The `AUSTENITE_INTEGER_MIN` variable is a **required** variable
that takes **integer** values with these constraints:

- Must be >= 1

### Example values

```sh
export AUSTENITE_INTEGER_MIN=1 # example
```

## `AUSTENITE_INTEGER_RANGE`

_Example integer with range constraint_

The `AUSTENITE_INTEGER_RANGE` variable is a **required** variable
that takes **integer** values with these constraints:

- Must be >= 3 and <= 4

### Example values

```sh
export AUSTENITE_INTEGER_RANGE=3 # example
```

## `AUSTENITE_NUMBER_MAX`

_Example number with inclusive maximum constraint_

The `AUSTENITE_NUMBER_MAX` variable is a **required** variable
that takes **number** values with these constraints:

- Must be <= 3

### Example values

```sh
export AUSTENITE_NUMBER_MAX=3 # example
```

## `AUSTENITE_NUMBER_MAX_EXCLUSIVE`

_Example number with exclusive maximum constraint_

The `AUSTENITE_NUMBER_MAX_EXCLUSIVE` variable is a **required** variable
that takes **number** values with these constraints:

- Must be < 4

### Example values

```sh
export AUSTENITE_NUMBER_MAX_EXCLUSIVE=3.9 # example
```

## `AUSTENITE_NUMBER_MIN`

_Example number with inclusive minimum constraint_

The `AUSTENITE_NUMBER_MIN` variable is a **required** variable
that takes **number** values with these constraints:

- Must be >= 1

### Example values

```sh
export AUSTENITE_NUMBER_MIN=1 # example
```

## `AUSTENITE_NUMBER_MIN_EXCLUSIVE`

_Example number with exclusive minimum constraint_

The `AUSTENITE_NUMBER_MIN_EXCLUSIVE` variable is a **required** variable
that takes **number** values with these constraints:

- Must be > 2

### Example values

```sh
export AUSTENITE_NUMBER_MIN_EXCLUSIVE=2.1 # example
```

## `AUSTENITE_NUMBER_RANGE`

_Example number with range constraint_

The `AUSTENITE_NUMBER_RANGE` variable is a **required** variable
that takes **number** values with these constraints:

- Must be >= 5 and < 6

### Example values

```sh
export AUSTENITE_NUMBER_RANGE=5.5 # example
```

## `AUSTENITE_PORT_NUMBER_MAX`

_Example port number with maximum constraint_

The `AUSTENITE_PORT_NUMBER_MAX` variable is a **required** variable
that takes **port number** values with these constraints:

- Must be <= 22222

### Example values

```sh
export AUSTENITE_PORT_NUMBER_MAX=22222 # example
```

## `AUSTENITE_PORT_NUMBER_MIN`

_Example port number with minimum constraint_

The `AUSTENITE_PORT_NUMBER_MIN` variable is a **required** variable
that takes **port number** values with these constraints:

- Must be >= 11111

### Example values

```sh
export AUSTENITE_PORT_NUMBER_MIN=11111 # example
```

## `AUSTENITE_PORT_NUMBER_RANGE`

_Example port number with range constraint_

The `AUSTENITE_PORT_NUMBER_RANGE` variable is a **required** variable
that takes **port number** values with these constraints:

- Must be >= 33333 and <= 44444

### Example values

```sh
export AUSTENITE_PORT_NUMBER_RANGE=33333 # example
```

## `AUSTENITE_STRING_LENGTH`

_Example string with length constraint_

The `AUSTENITE_STRING_LENGTH` variable is a **required** variable
that takes **string** values with these constraints:

- Must have a length of 1

### Example values

```sh
export AUSTENITE_STRING_LENGTH=a # example
```

## `AUSTENITE_STRING_LENGTH_RANGE`

_Example string with length range constraint_

The `AUSTENITE_STRING_LENGTH_RANGE` variable is a **required** variable
that takes **string** values with these constraints:

- Must have a length between 4 and 5

### Example values

```sh
export AUSTENITE_STRING_LENGTH_RANGE=abcd # example
```

## `AUSTENITE_STRING_MAX_LENGTH`

_Example string with maximum length constraint_

The `AUSTENITE_STRING_MAX_LENGTH` variable is a **required** variable
that takes **string** values with these constraints:

- Must have a maximum length of 3

### Example values

```sh
export AUSTENITE_STRING_MAX_LENGTH=abc # example
```

## `AUSTENITE_STRING_MIN_LENGTH`

_Example string with minimum length constraint_

The `AUSTENITE_STRING_MIN_LENGTH` variable is a **required** variable
that takes **string** values with these constraints:

- Must have a minimum length of 2

### Example values

```sh
export AUSTENITE_STRING_MIN_LENGTH=ab # example
```
