const NEEDS_QUOTES_PATTERN = /[^\w@%+=:,./-]/;

export function quote(argument: string) {
  if (!NEEDS_QUOTES_PATTERN.test(argument)) return argument;

  return `'${argument.replaceAll(`'`, `'"'"'`)}'`;
}
