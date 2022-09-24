import { read } from "./environment";
import { UndefinedError } from "./errors";
import { Options } from "./options";
import { Variable } from "./variable";

export function string<O extends Options<string>>(
  name: string,
  _description: string,
  options: O | undefined = undefined
): Variable<string, O> {
  const { default: d, required = true } = options ?? {};

  return {
    value() {
      const v = read(name);

      if (v != "") return v;
      if (d != null) return d;
      if (required) throw new UndefinedError(name);

      return undefined;
    },
  } as Variable<string, O>;
}
