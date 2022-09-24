export class UndefinedError extends Error {
  constructor(name: string) {
    super(`${name} is undefined and does not have a default value.`);
  }
}

export function describeError(error: Error) {
  if (error instanceof UndefinedError) return "undefined";

  return error.message;
}
