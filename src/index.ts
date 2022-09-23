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
  options: O
): Variable<O> {
  return {
    value() {
      const envValue = process.env[name];

      if (typeof envValue === "string") return envValue;

      if (options.required && options.default == null) {
        throw new Error(
          `${name} is undefined and does not have a default value`
        );
      }

      return options.default;
    },
  } as Variable<O>;
}

export function initialize(): void {
  return;
}
