# Austenite

_Declarative environment variables for TypeScript._

[![Current version][badge-version-image]][badge-version-link]
[![Build status][badge-build-image]][badge-build-link]
[![Test coverage][badge-coverage-image]][badge-coverage-link]

[badge-build-image]:
  https://img.shields.io/github/actions/workflow/status/ezzatron/austenite/ci-node-library.yml?branch=main&style=for-the-badge
[badge-build-link]:
  https://github.com/ezzatron/austenite/actions/workflows/ci-node-library.yml
[badge-coverage-image]:
  https://img.shields.io/codecov/c/gh/ezzatron/austenite?style=for-the-badge
[badge-coverage-link]: https://codecov.io/gh/ezzatron/austenite
[badge-version-image]:
  https://img.shields.io/npm/v/austenite?label=austenite&logo=npm&style=for-the-badge
[badge-version-link]: https://npmjs.com/package/austenite

## Usage

```ts
// env.ts - declares everything needed from the environment
import { boolean, url } from "austenite";

export const cdnUrl = url("CDN_URL", "CDN to use when serving static assets");
export const isDebug = boolean(
  "DEBUG",
  "enable or disable debugging features",
  { default: false },
);
```

```ts
// run.ts - starts the service/app, uses declarations from above
import { initialize } from "austenite/node";
import { cdnUrl, isDebug } from "./env.ts";

// validates the environment, option defaults shown here
await initialize({
  // set to "none" to disable Markdown pretty-printing
  markdownPrettyPrint: "prettier",
});

// cdnUrl.value() is a URL
console.log(`CDN URL hostname is ${cdnUrl.value().hostname}`);

// isDebug.value() is a boolean
console.log(`Debug mode is ${isDebug.value() ? "enabled" : "disabled"}`);
```

## Validation summaries

If the environment is invalid, calling `initialize()` will terminate the process
with a non-zero exit code, and output a table that describes what went wrong:

```
Environment Variables:

❯ CDN_URL                     CDN to use when serving static assets         <URL>                                         ✗ set to host.example.org, must be a URL
❯ DEBUG                       enable or disable debugging features        [ true | false ] = false                        ✗ set to yes, expected true or false
❯ EARTH_ATOM_COUNT            number of atoms on earth                    [ <big integer> ]                               ✗ set to 5.9722e24, must be a big integer
❯ GRPC_TIMEOUT                gRPC request timeout                        [ <ISO 8601 duration> ]                         ✗ set to PT30S, must be <= PT10S
❯ LOG_LEVEL                   the minimum log level to record             [ debug | info | warn | error | fatal ] = info  ✗ set to silly, expected debug, info, warn, error, or fatal
❯ PORT                        listen port for the HTTP server             [ <port number> ] = 8080                        ✗ set to 65536, must be between 1 and 65535
❯ READ_DSN                    database connection string for read-models    <string>                                      ✗ set to host=localhost, must have a minimum length of 30, but has a length of 14
❯ REDIS_PRIMARY_SERVICE_HOST  kubernetes `redis-primary` service host       <hostname>                                    ✗ set to .redis.example.org, must not begin or end with a dot
❯ REDIS_PRIMARY_SERVICE_PORT  kubernetes `redis-primary` service port       <port number>                                 ✗ set to 65536, must be between 1 and 65535
❯ SAMPLE_RATIO                ratio of requests to sample                 [ <number> ]                                    ✗ set to 1/100, must be numeric
❯ SESSION_KEY                 session token signing key                     <base64>                                      ✗ set to <sensitive value>, must be base64 encoded
❯ WEIGHT                      weighting for this node                       <integer>                                     ✗ set to 0, must be >= 1
```

## Generated usage documentation

If the environment variable `AUSTENITE_MODE` is set to `usage/markdown`, calling
`initialize()` will terminate the process with a zero exit code, and output a
Markdown document containing usage documentation for the environment variables
consumed by each declaration.

<!-- prettier-ignore-start -->
> [!IMPORTANT]
> See [ENVIRONMENT.md](ENVIRONMENT.md) for example output.
<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->
> [!TIP]
> If you have the [`prettier` NPM package] installed, Austenite will
> pretty-print Markdown output according to your Prettier config for a file at
> `./ENVIRONMENT.md`.
>
> If you have Prettier installed, but don't have a config file for
> `./ENVIRONMENT.md`, Austenite will use its own default Prettier config.
>
> If you don't have Prettier installed, or if you set the `markdownPrettyPrint`
> option to `"none"`, Austenite won't pretty-print Markdown output.
<!-- prettier-ignore-end -->

[`prettier` npm package]: https://npmjs.com/package/prettier

## Declarations

### `bigInteger`

```ts
import { bigInteger } from "austenite";

// required
export const earthAtomCount = bigInteger(
  "EARTH_ATOM_COUNT",
  "number of atoms on earth",
);

// optional
export const earthAtomCount = bigInteger(
  "EARTH_ATOM_COUNT",
  "number of atoms on earth",
  { default: undefined },
);

// default
export const earthAtomCount = bigInteger(
  "EARTH_ATOM_COUNT",
  "number of atoms on earth",
  { default: 5_972_200_000_000_000_000_000_000n },
);

// min/max
export const earthAtomCount = bigInteger(
  "EARTH_ATOM_COUNT",
  "number of atoms on earth",
  {
    min: 5_000_000_000_000_000_000_000_000n,
    max: 6_000_000_000_000_000_000_000_000n,
  },
);

// example values
export const earthAtomCount = bigInteger(
  "EARTH_ATOM_COUNT",
  "number of atoms on earth",
  {
    examples: [
      { value: 5_000_000_000_000_000_000_000_000n, label: "5 septillion" },
      {
        value: 6_000_000_000_000_000_000_000_000n,
        as: "0x4f68ca6d8cd91c6000000",
        label: "6 septillion",
      },
    ],
  },
);

// constraints
export const earthAtomCount = bigInteger(
  "EARTH_ATOM_COUNT",
  "number of atoms on earth",
  {
    constraints: [
      {
        description: "must be a multiple of 1000",
        constrain: (v) => v % 1_000n === 0n || "must be a multiple of 1000",
      },
    ],
    examples: [
      { value: 5_972_200_000_000_000_000_000_000n, label: "5.9722 septillion" },
    ],
  },
);
```

### `binary`

```ts
import { binary } from "austenite";

// required
export const sessionKey = binary("SESSION_KEY", "session token signing key");

// sensitive
export const sessionKey = binary("SESSION_KEY", "session token signing key", {
  isSensitive: true,
});

// optional
export const sessionKey = binary("SESSION_KEY", "session token signing key", {
  default: undefined,
});

// default
export const sessionKey = binary("SESSION_KEY", "session token signing key", {
  default: Buffer.from("SUPER_SECRET_256_BIT_SIGNING_KEY", "utf-8"),
});

// base64url
export const sessionKey = binary("SESSION_KEY", "session token signing key", {
  encoding: "base64url",
});

// hex
export const sessionKey = binary("SESSION_KEY", "session token signing key", {
  encoding: "hex",
});

// exact length
export const sessionKey = binary("SESSION_KEY", "session token signing key", {
  length: 32,
});

// min/max length
export const sessionKey = binary("SESSION_KEY", "session token signing key", {
  length: { min: 32, max: 64 },
});

// example values
export const sessionKey = binary("SESSION_KEY", "session token signing key", {
  examples: [
    {
      value: Buffer.from("128_BIT_SIGN_KEY", "utf-8"),
      label: "128-bit key",
    },
    {
      value: Buffer.from("SUPER_SECRET_256_BIT_SIGNING_KEY", "utf-8"),
      as: "U1VQRVJfU0VDUkVUXzI1Nl9CSVRfU0lHTklOR19LRVk",
      label: "256-bit key",
    },
  ],
});

// constraints
export const sessionKey = binary("SESSION_KEY", "session token signing key", {
  constraints: [
    {
      description: "must be 128 or 256 bits",
      constrain: (v) =>
        [16, 32].includes(v.length) || "decoded length must be 16 or 32",
    },
  ],
  examples: [
    {
      value: Buffer.from("SUPER_SECRET_256_BIT_SIGNING_KEY", "utf-8"),
      label: "256-bit key",
    },
  ],
});
```

### `boolean`

```ts
import { boolean } from "austenite";

// required
export const isDebug = boolean("DEBUG", "enable or disable debugging features");

// optional
export const isDebug = boolean(
  "DEBUG",
  "enable or disable debugging features",
  { default: undefined },
);

// default
export const isDebug = boolean(
  "DEBUG",
  "enable or disable debugging features",
  { default: false },
);

// custom literals
export const isDebug = boolean(
  "DEBUG",
  "enable or disable debugging features",
  { literals: { y: true, yes: true, n: false, no: false } },
);

// example values
export const isDebug = boolean(
  "DEBUG",
  "enable or disable debugging features",
  {
    literals: { y: true, yes: true, n: false, no: false },
    examples: [
      { value: true, label: "enabled" },
      { value: false, as: "no", label: "disabled" },
    ],
  },
);

// constraints
export const isDebug = boolean(
  "DEBUG",
  "enable or disable debugging features",
  {
    constraints: [
      {
        description: "must not be enabled on Windows",
        constrain: (v) =>
          !v ||
          process.platform !== "win32" ||
          "must not be enabled on Windows",
      },
    ],
    examples: [{ value: false, label: "disabled" }],
  },
);
```

### `duration`

```ts
import { Temporal } from "@js-temporal/polyfill";
import { duration } from "austenite";

// required
export const grpcTimeout = duration("GRPC_TIMEOUT", "gRPC request timeout");

// optional
export const grpcTimeout = duration("GRPC_TIMEOUT", "gRPC request timeout", {
  default: undefined,
});

// default
export const grpcTimeout = duration("GRPC_TIMEOUT", "gRPC request timeout", {
  default: Temporal.Duration.from("PT10S"),
});

// min/max
export const grpcTimeout = duration("GRPC_TIMEOUT", "gRPC request timeout", {
  min: Temporal.Duration.from({ milliseconds: 100 }),
  max: Temporal.Duration.from({ seconds: 10 }),
});

// example values
export const grpcTimeout = duration("GRPC_TIMEOUT", "gRPC request timeout", {
  examples: [
    {
      value: Temporal.Duration.from({ milliseconds: 100 }),
      label: "100 milliseconds",
    },
    {
      value: Temporal.Duration.from({ seconds: 5 }),
      as: "P0DT5S",
      label: "5 seconds",
    },
  ],
});

// constraints
export const grpcTimeout = duration("GRPC_TIMEOUT", "gRPC request timeout", {
  constraints: [
    {
      description: "must be a multiple of 100 milliseconds",
      constrain: (v) =>
        v.milliseconds % 100 === 0 || "must be a multiple of 100 milliseconds",
    },
  ],
  examples: [
    {
      value: Temporal.Duration.from({ milliseconds: 100 }),
      label: "100 milliseconds",
    },
  ],
});
```

### `enumeration`

```ts
import { enumeration } from "austenite";

const members = {
  debug: { value: "debug", description: "show information for developers" },
  info: { value: "info", description: "standard log messages" },
  warn: {
    value: "warn",
    description: "important, but don't need individual human review",
  },
  error: {
    value: "error",
    description: "a healthy application shouldn't produce any errors",
  },
  fatal: { value: "fatal", description: "the application cannot proceed" },
} as const;

// required
export const logLevel = enumeration(
  "LOG_LEVEL",
  "the minimum log level to record",
  members,
);

// optional
export const logLevel = enumeration(
  "LOG_LEVEL",
  "the minimum log level to record",
  members,
  { default: undefined },
);

// default
export const logLevel = enumeration(
  "LOG_LEVEL",
  "the minimum log level to record",
  members,
  { default: "error" },
);

// example values
export const logLevel = enumeration(
  "LOG_LEVEL",
  "the minimum log level to record",
  members,
  {
    examples: [
      { value: "debug", label: "if you want lots of output" },
      {
        value: "error",
        label: "if you only want to see when things go wrong",
      },
    ],
  },
);

// constraints
export const logLevel = enumeration(
  "LOG_LEVEL",
  "the minimum log level to record",
  members,
  {
    constraints: [
      {
        description: "must not be debug on Windows",
        constrain: (v) =>
          v !== "debug" ||
          process.platform !== "win32" ||
          "must not be debug on Windows",
      },
    ],
    examples: [
      { value: "error", label: "if you only want to see when things go wrong" },
    ],
  },
);
```

### `integer`

```ts
import { integer } from "austenite";

// required
export const weight = integer("WEIGHT", "weighting for this node");

// optional
export const weight = integer("WEIGHT", "weighting for this node", {
  default: undefined,
});

// default
export const weight = integer("WEIGHT", "weighting for this node", {
  default: 123,
});

// min/max
export const weight = integer("WEIGHT", "weighting for this node", {
  min: 1,
  max: 1000,
});

// example values
export const weight = integer("WEIGHT", "weighting for this node", {
  examples: [
    { value: 1, label: "lowest weight" },
    { value: 1000, as: "1e3", label: "highest weight" },
  ],
});

// constraints
export const weight = integer("WEIGHT", "weighting for this node", {
  constraints: [
    {
      description: "must be a multiple of 10",
      constrain: (v) => v % 10 === 0 || "must be a multiple of 10",
    },
  ],
  examples: [{ value: 100, label: "100" }],
});
```

### `kubernetesAddress`

```ts
import { kubernetesAddress } from "austenite";

// required
export const redisPrimary = kubernetesAddress("redis-primary");

// optional
export const redisPrimary = kubernetesAddress("redis-primary", {
  default: undefined,
});

// default
export const redisPrimary = kubernetesAddress("redis-primary", {
  default: { host: "redis.example.org", port: 6379 },
});

// example values
export const redisPrimary = kubernetesAddress("redis-primary", {
  examples: {
    host: [
      { value: "redis.example.org", label: "remote" },
      { value: "redis.localhost", label: "local" },
    ],
    port: [
      { value: 6379, label: "standard" },
      { value: 6380, label: "alternate" },
    ],
  },
});

// constraints
const const redisPrimary = kubernetesAddress("redis-primary", {
  constraints: [
    {
      description: "must be allowed",
      constrain: ({ host, port }) =>
        [
          "insecure.redis.example.org:80",
          "secure.redis.example.org:443",
        ].includes(`${host}:${port}`) || "not allowed",
    },
  ],
});
```

### `networkPortNumber`

```ts
import { networkPortNumber } from "austenite";

// required
export const port = networkPortNumber(
  "PORT",
  "listen port for the HTTP server",
);

// optional
export const port = networkPortNumber(
  "PORT",
  "listen port for the HTTP server",
  { default: undefined },
);

// default
export const port = networkPortNumber(
  "PORT",
  "listen port for the HTTP server",
  { default: 8080 },
);

// min/max
export const port = networkPortNumber(
  "PORT",
  "listen port for the HTTP server",
  { min: 49152, max: 65535 },
);

// example values
export const port = networkPortNumber(
  "PORT",
  "listen port for the HTTP server",
  {
    examples: [
      { value: 80, label: "standard web" },
      { value: 50080, label: "ephemeral" },
    ],
  },
);

// constraints
export const port = networkPortNumber(
  "PORT",
  "listen port for the HTTP server",
  {
    constraints: [
      {
        description: "must not be disallowed",
        constrain: (v) => ![1337, 31337].includes(v) || "not allowed",
      },
    ],
    examples: [{ value: 8080, label: "standard" }],
  },
);
```

### `number`

```ts
import { number } from "austenite";

// required
export const sampleRatio = number(
  "SAMPLE_RATIO",
  "ratio of requests to sample",
);

// optional
export const sampleRatio = number(
  "SAMPLE_RATIO",
  "ratio of requests to sample",
  { default: undefined },
);

// default
export const sampleRatio = number(
  "SAMPLE_RATIO",
  "ratio of requests to sample",
  { default: 0.01 },
);

// min/max
export const sampleRatio = number(
  "SAMPLE_RATIO",
  "ratio of requests to sample",
  { min: 0.01, max: 0.25 },
);

// example values
export const sampleRatio = number(
  "SAMPLE_RATIO",
  "ratio of requests to sample",
  {
    examples: [
      { value: 0.01, label: "1%" },
      { value: 0.25, as: "2.5e-1", label: "25%" },
    ],
  },
);

// constraints
export const sampleRatio = number(
  "SAMPLE_RATIO",
  "ratio of requests to sample",
  {
    constraints: [
      {
        description: "must be a multiple of 0.01",
        constrain: (v) => v % 0.01 === 0 || "must be a multiple of 0.01",
      },
    ],
    examples: [{ value: 0.01, label: "1%" }],
  },
);
```

### `string`

```ts
import { string } from "austenite";

// required
export const readDsn = string(
  "READ_DSN",
  "database connection string for read-models",
);

// sensitive
export const readDsn = string(
  "READ_DSN",
  "database connection string for read-models",
  { isSensitive: true },
);

// optional
export const readDsn = string(
  "READ_DSN",
  "database connection string for read-models",
  { default: undefined },
);

// default
export const readDsn = string(
  "READ_DSN",
  "database connection string for read-models",
  { default: "host=localhost dbname=readmodels user=projector" },
);

// exact length
export const readDsn = string(
  "READ_DSN",
  "database connection string for read-models",
  { length: 100 },
);

// min/max length
export const readDsn = string(
  "READ_DSN",
  "database connection string for read-models",
  { length: { min: 100, max: 1000 } },
);

// example values
export const readDsn = string(
  "READ_DSN",
  "database connection string for read-models",
  {
    examples: [
      {
        value: "host=localhost dbname=readmodels user=projector",
        label: "local",
      },
      {
        value: "host=remote.example.org dbname=readmodels user=projector",
        label: "remote",
      },
    ],
  },
);

// constraints
export const readDsn = string(
  "READ_DSN",
  "database connection string for read-models",
  {
    constraints: [
      {
        description: "must not contain a password",
        constrain: (v) =>
          !v.includes("password") || "must not contain a password",
      },
    ],
    examples: [
      {
        value: "host=localhost dbname=readmodels user=projector",
        label: "local",
      },
    ],
  },
);
```

### `url`

```ts
import { url } from "austenite";

// required
export const cdnUrl = url("CDN_URL", "CDN to use when serving static assets");

// optional
export const cdnUrl = url("CDN_URL", "CDN to use when serving static assets", {
  default: undefined,
});

// default
export const cdnUrl = url("CDN_URL", "CDN to use when serving static assets", {
  default: new URL("https://host.example.org/path/to/resource"),
});

// limit to specified protocol(s)
export const cdnUrl = url("CDN_URL", "CDN to use when serving static assets", {
  protocols: ["https"],
});

// resolve against a base URL
export const cdnUrl = url("CDN_URL", "CDN to use when serving static assets", {
  base: new URL("https://host.example.org/path/to/base"),
});

// example values
export const cdnUrl = url("CDN_URL", "CDN to use when serving static assets", {
  base: new URL("https://host.example.org/path/to/"),
  examples: [
    {
      value: new URL("https://host.example.org/path/to/resource"),
      label: "absolute",
    },
    {
      value: new URL("https://host.example.org/path/to/resource"),
      as: "resource",
      label: "relative",
    },
  ],
});

// constraints
export const cdnUrl = url("CDN_URL", "CDN to use when serving static assets", {
  constraints: [
    {
      description: "must not be a local URL",
      constrain: (v) =>
        !v.hostname.endsWith(".local") || "must not be a local URL",
    },
  ],
  examples: [
    {
      value: new URL("https://host.example.org/path/to/resource"),
      label: "absolute",
    },
  ],
});
```

### Constraints

You can specify custom constraints in a few ways.

To make a constraint fail, you can either throw an error or return an error
message string.

To make a constraint pass, don't throw, and don't return anything, or return
`undefined` if you prefer to be explicit. You can also return `true` to make
your constraint pass, if you want to use the `||` operator for a more compact
expression.

```ts
// exception-based constraint

import { string } from "austenite";

export const readDsn = string(
  "READ_DSN",
  "database connection string for read-models",
  {
    constraints: [
      {
        description: "must not contain a password",
        constrain: (v) => {
          // pass by not throwing
          if (!v.includes("password")) return;

          // fail by throwing an error
          throw new Error("must not contain a password");
        },
      },
    ],
  },
);
```

```ts
// return-based constraint

import { string } from "austenite";

export const readDsn = string(
  "READ_DSN",
  "database connection string for read-models",
  {
    constraints: [
      {
        description: "must not contain a password",
        constrain: (v) => {
          // pass by returning undefined
          if (!v.includes("password")) return undefined;

          // fail by returning a string
          return "must not contain a password";
        },
      },
    ],
  },
);
```

```ts
// compact return-based constraint

import { string } from "austenite";

export const readDsn = string(
  "READ_DSN",
  "database connection string for read-models",
  {
    constraints: [
      {
        description: "must not contain a password",
        constrain: (v) =>
          !v.includes("password") || "must not contain a password",
      },
    ],
  },
);
```

### Explicit typing

If you want to explicitly type your declarations, you can use the
`Declaration<T>` type:

```ts
import { type Declaration } from "austenite";

export const nodeEnv: Declaration<"development" | "production"> = enumeration(
  "NODE_ENV",
  "Node.js environment",
  {
    development: {
      value: "development",
      description: "the app is under active development",
    },
    production: {
      value: "production",
      description: "the app is running normally",
    },
  },
  {
    default: "development",
  },
);
```

If your declaration is optional, you must include `undefined` in the union type:

```ts
import { type Declaration } from "austenite";

export const nodeEnv: Declaration<"development" | "production" | undefined> =
  enumeration(
    "NODE_ENV",
    "Node.js environment",
    {
      development: {
        value: "development",
        description: "the app is under active development",
      },
      production: {
        value: "production",
        description: "the app is running normally",
      },
    },
    {
      default: undefined,
    },
  );
```

## See also

This package is heavily inspired by [Ferrite], which provides similar features
for Go.

[ferrite]: https://github.com/dogmatiq/ferrite
