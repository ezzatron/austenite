interface Variable {
  value: () => string;
}

export function string(_name: string, _description: string): Variable {
  return {
    value() {
      return process.env[_name] ?? "";
    },
  };
}

export function initialize(): void {
  return;
}
