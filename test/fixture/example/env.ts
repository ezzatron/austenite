import { Temporal } from "@js-temporal/polyfill";
import {
  bigInteger,
  binary,
  boolean,
  duration,
  enumeration,
  integer,
  kubernetesAddress,
  networkPortNumber,
  number,
  string,
  url,
} from "austenite";

export const cdnUrl = url("CDN_URL", "CDN to use when serving static assets", {
  protocols: ["http:", "https:"],
});

export const earthAtomCount = bigInteger(
  "EARTH_ATOM_COUNT",
  "number of atoms on earth",
  { default: undefined },
);

export const grpcTimeout = duration("GRPC_TIMEOUT", "gRPC request timeout", {
  default: undefined,
  min: Temporal.Duration.from({ milliseconds: 100 }),
  max: Temporal.Duration.from({ seconds: 10 }),
  examples: [
    {
      value: Temporal.Duration.from({ milliseconds: 300 }),
      label: "300 milliseconds",
    },
    {
      value: Temporal.Duration.from({ seconds: 5 }),
      label: "5 seconds",
    },
  ],
});

export const isDebug = boolean(
  "DEBUG",
  "enable or disable debugging features",
  { default: false },
);

export const logLevel = enumeration(
  "LOG_LEVEL",
  "the minimum log level to record",
  {
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
  },
  { default: "info" },
);

export const port = networkPortNumber(
  "PORT",
  "listen port for the HTTP server",
  { default: 8080 },
);

export const readDsn = string(
  "READ_DSN",
  "database connection string for read-models",
  {
    length: { min: 30 },
    examples: [
      {
        value: "host=localhost dbname=readmodels user=projector",
        label: "local database",
      },
    ],
  },
);

export const redisPrimary = kubernetesAddress("redis-primary");

export const sampleRatio = number(
  "SAMPLE_RATIO",
  "ratio of requests to sample",
  { default: undefined },
);

export const sessionKey = binary("SESSION_KEY", "session token signing key", {
  isSensitive: true,
});

export const weight = integer("WEIGHT", "weighting for this node", {
  min: 1,
  examples: [
    { value: 1, label: "lowest" },
    { value: 100, label: "high" },
    { value: 1000, label: "very high" },
  ],
});
