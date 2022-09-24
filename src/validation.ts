export class ValidationError extends Error {
  constructor(public readonly name: string, message: string) {
    super(message);
  }
}

export class UndefinedError extends ValidationError {
  constructor(name: string) {
    super(name, "undefined");
  }
}
