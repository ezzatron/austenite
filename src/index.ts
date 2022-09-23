interface Variable {
  value: () => string;
}

interface Options {
  required: boolean;
  default?: string;
}

export function string(
  name: string,
  _description: string,
  options: Options
): Variable {
  return {
    value() {
      const envValue = process.env[name];

      if (typeof envValue === "string") return envValue;

      if (options.default == null) {
        throw new Error(
          `${name} is undefined and does not have a default value`
        );
      }

      return options.default;
    },
  };
}

export function initialize(): void {
  return;
}
