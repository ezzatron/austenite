import { register, result } from "./environment";
import { UndefinedError } from "./errors";
import { Options } from "./options";
import { READ, Variable } from "./variable";

export function string<O extends Options<string>>(
  name: string,
  description: string,
  options: O | undefined = undefined
): Variable<string, O> {
  const { default: d, required = true } = options ?? {};

  return register({
    name,
    description,
    schema: "<string>",

    value() {
      return result(name);
    },

    [READ](readEnv) {
      const v = readEnv(name);

      if (v != "") return v;
      if (d != null) return d;
      if (required) throw new UndefinedError(name);

      return undefined;
    },
  } as Variable<string, O>);
}
