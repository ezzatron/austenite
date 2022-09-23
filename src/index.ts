interface Options {
  required: boolean;
  default?: string;
}

interface Variable<O extends Options> {
  value: () => O["required"] extends false ? string | undefined : string;
}

export function string<O extends Options>(
  name: string,
  _description: string,
  { default: d, required }: O
): Variable<O> {
  return {
    value() {
      const v = process.env[name];

      if (typeof v === "string" && v != "") return v;
      if (required && d == null) throw new UndefinedError(name);

      return d;
    },
  } as Variable<O>;
}

export function initialize(): void {
  return;
}

class UndefinedError extends Error {
  constructor(name: string) {
    super(`${name} is undefined and does not have a default value`);
  }
}
