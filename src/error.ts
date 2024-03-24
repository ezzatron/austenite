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
