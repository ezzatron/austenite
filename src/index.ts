interface Variable {
  value: () => string;
}

export function string(_name: string, _description: string): Variable {
  return {
    value() {
      return "<value>";
    },
  };
}

export function initialize(): void {
  return;
}
