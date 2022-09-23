interface Options<T> {
  required: boolean;
  default?: T;
}

interface Variable<T, O extends Options<T>> {
  value: () => O["required"] extends false ? T | undefined : T;
}

export function boolean<O extends Options<boolean>>(
  name: string,
  _description: string,
  { default: d, required }: O
): Variable<boolean, O> {
  return {
    value() {
      const v = process.env[name];

      if (typeof v === "string" && v != "") {
        if (v === "true") return true;
        if (v === "false") return false;
        throw new InvalidBooleanError(name, v);
      }

      if (required && d == null) throw new UndefinedError(name);

      return d;
    },
  } as Variable<boolean, O>;
}

export function string<O extends Options<string>>(
  name: string,
  _description: string,
  { default: d, required }: O
): Variable<string, O> {
  return {
    value() {
      const v = process.env[name];

      if (typeof v === "string" && v != "") return v;
      if (required && d == null) throw new UndefinedError(name);

      return d;
    },
  } as Variable<string, O>;
}

export function initialize(): void {
  return;
}

class UndefinedError extends Error {
  constructor(name: string) {
    super(`${name} is undefined and does not have a default value`);
  }
}

class InvalidBooleanError extends Error {
  constructor(name: string, value: string) {
    const quotedValue = JSON.stringify(value);

    super(
      `The value of ${name} (${quotedValue}) is invalid: expected either "true" or "false".`
    );
  }
}
