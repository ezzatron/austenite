import { register, result } from "./environment";
import { UndefinedError } from "./validation";
import { Options, READ, Variable } from "./variable";

export function string<O extends Options<string>>(
  name: string,
  description: string,
  options: O | undefined = undefined
): Variable<string, O> {
  const { default: d, required = true } = options ?? {};

  const variable: Variable<string, O> = {
    name,
    description,
    schema: "<string>",

    value() {
      return result(variable);
    },

    [READ](readEnv) {
      const v = readEnv(name);

      if (v != "") return v;
      if (d != null) return d;
      if (required) throw new UndefinedError(name);

      return undefined;
    },
  };

  return register(variable);
}
