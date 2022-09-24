import { register, result } from "./environment";
import { UndefinedError } from "./validation";
import { Options as CommonOptions, READ, Variable } from "./variable";

export function string<O extends Options>(
  name: string,
  description: string,
  options: O | undefined = undefined
): Variable<string, O> {
  const { default: defaultValue, required = true } = options ?? {};

  const variable: Variable<string, O> = {
    name,
    description,
    schema: "<string>",

    value() {
      return result(variable);
    },

    [READ](readEnv) {
      const value = readEnv(name);

      if (value != "") return value;
      if (defaultValue != null) return defaultValue;
      if (required) throw new UndefinedError(name);

      return undefined;
    },
  };

  return register(variable);
}

type Options = CommonOptions<string>;
