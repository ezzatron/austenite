import {
  bigInteger,
  boolean,
  duration,
  enumeration,
  initialize,
  integer,
  kubernetesAddress,
  number,
  string,
  url,
} from "@eloquent/austenite";

export const cdnUrl = url("CDN_URL", "CDN to use when serving static assets");

export const earthAtomCount = bigInteger(
  "EARTH_ATOM_COUNT",
  "number of atoms on earth"
);

export const grpcTimeout = duration("GRPC_TIMEOUT", "gRPC request timeout");
export const isDebug = boolean("DEBUG", "enable or disable debugging features");

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
  }
);

export const readDsn = string(
  "READ_DSN",
  "database connection string for read-models"
);

export const redisPrimary = kubernetesAddress("redis-primary");

export const sampleRatio = number(
  "SAMPLE_RATIO",
  "ratio of requests to sample"
);

export const weight = integer("WEIGHT", "weighting for this node");

initialize();
