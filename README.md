# Austenite

_Declarative environment variables for Node.js._

[![Current version][badge-version-image]][badge-version-link]
[![Build status][badge-build-image]][badge-build-link]
[![Test coverage][badge-coverage-image]][badge-coverage-link]

[badge-build-image]: https://img.shields.io/github/actions/workflow/status/ezzatron/austenite/ci-node-library.yml?branch=main&style=for-the-badge
[badge-build-link]: https://github.com/ezzatron/austenite/actions/workflows/ci-node-library.yml
[badge-coverage-image]: https://img.shields.io/codecov/c/gh/ezzatron/austenite?style=for-the-badge
[badge-coverage-link]: https://codecov.io/gh/ezzatron/austenite
[badge-version-image]: https://img.shields.io/npm/v/austenite?label=austenite&logo=npm&style=for-the-badge
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
import { initialize } from "austenite";
import { cdnUrl, isDebug } from "./env.ts";

initialize(); // validates the environment

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
❯ GRPC_TIMEOUT                gRPC request timeout                        [ <ISO 8601 duration> ]                         ✗ set to 10S, must be an ISO 8601 duration
❯ LOG_LEVEL                   the minimum log level to record             [ debug | info | warn | error | fatal ] = info  ✗ set to silly, expected debug, info, warn, error, or fatal
❯ PORT                        listen port for the HTTP server             [ <port number> ] = 8080                        ✗ set to 65536, must be between 1 and 65535
❯ READ_DSN                    database connection string for read-models    <string>                                      ✗ not set
❯ REDIS_PRIMARY_SERVICE_HOST  kubernetes `redis-primary` service host       <hostname>                                    ✗ set to .redis.example.org, must not begin or end with a dot
❯ REDIS_PRIMARY_SERVICE_PORT  kubernetes `redis-primary` service port       <port number>                                 ✗ set to 65536, must be between 1 and 65535
❯ SAMPLE_RATIO                ratio of requests to sample                 [ <number> ]                                    ✗ set to 1/100, must be numeric
❯ SESSION_KEY                 session token signing key                     <base64>                                      ✗ set to <sensitive value>, must be base64 encoded
❯ WEIGHT                      weighting for this node                       <integer>                                     ✗ set to 123.456, must be an integer
```

## Generated environment specifications

If the environment variable `AUSTENITE_SPEC` is set to `true`, calling
`initialize()` will terminate the process with a zero exit code, and output a
Markdown document containing a specification of the environment variables
consumed by each declaration.

> See [ENVIRONMENT.md](ENVIRONMENT.md) for example output

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
  { default: 5972200000000000000000000n },
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
  {
    literals: {
      y: true,
      yes: true,
      n: false,
      no: false,
    },
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
  default: Temporal.Duration.from({ milliseconds: 10 }),
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
  default: {
    host: "redis.example.org",
    port: 6379,
  },
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
  {
    default: undefined,
  },
);

// default
export const port = networkPortNumber(
  "PORT",
  "listen port for the HTTP server",
  {
    default: 8080,
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
```

## See also

This package is heavily inspired by [Ferrite], which provides similar features
for Go.

[ferrite]: https://github.com/dogmatiq/ferrite
