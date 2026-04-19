/* v8 ignore start -- @preserve */
export const Temporal =
  typeof globalThis.Temporal !== "undefined"
    ? globalThis.Temporal
    : ((await import("@js-temporal/polyfill"))
        .Temporal as unknown as typeof globalThis.Temporal);
/* v8 ignore stop -- @preserve */
