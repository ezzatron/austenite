import { quote } from "./shell.js";

export function normalize(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

export class SpecError extends Error {
  constructor(
    public readonly name: string,
    public readonly cause: Error,
  ) {
    super(`specification for ${name} is invalid: ${cause.message}`);
  }
}

export class ValueError extends Error {
  constructor(
    public readonly name: string,
    public readonly isSensitive: boolean,
    public readonly value: string,
    public readonly cause: Error,
  ) {
    const renderedValue = isSensitive ? "<sensitive value>" : quote(value);

    super(`value of ${name} (${renderedValue}) is invalid: ${cause.message}`);
  }
}

export class NotSetError extends Error {
  constructor(public readonly name: string) {
    super(`${name} is not set and does not have a default value`);
  }
}
