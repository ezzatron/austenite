interface Variable {
  value: () => string;
}

interface Options {
  required: boolean;
}

export function string(
  name: string,
  _description: string,
  _options: Options
): Variable {
  return {
    value() {
      return process.env[name] ?? "";
    },
  };
}

export function initialize(): void {
  return;
}
