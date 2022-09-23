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
      return process.env[name] ?? options.default ?? "";
    },
  };
}

export function initialize(): void {
  return;
}
