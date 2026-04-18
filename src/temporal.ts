export const Temporal =
  typeof globalThis.Temporal !== "undefined"
    ? globalThis.Temporal
    : ((await import("@js-temporal/polyfill"))
        .Temporal as unknown as typeof globalThis.Temporal);
