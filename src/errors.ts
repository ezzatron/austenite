export class UndefinedError extends Error {
  constructor(name: string) {
    super(`${name} is undefined and does not have a default value`);
  }
}
