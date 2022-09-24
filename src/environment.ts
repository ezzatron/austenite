let isInitialized = false;

export function initialize(): void {
  isInitialized = true;
}

export function reset(): void {
  isInitialized = false;
}

export function register(name: string): void {
  if (isInitialized) throw new FinalizedError(name);
}

export function read(name: string): string {
  if (!isInitialized) throw new UninitializedError(name);

  return process.env[name] ?? "";
}

class FinalizedError extends Error {
  constructor(name: string) {
    super(`${name} can not be defined after the environment is initialized.`);
  }
}
class UninitializedError extends Error {
  constructor(name: string) {
    super(`${name} can not be read until the environment is initialized.`);
  }
}
