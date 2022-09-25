import { register, result } from "./environment";
import { Options as CommonOptions, READ, Variable } from "./variable";

export function string<O extends Options>(
  name: string,
  description: string,
  options: O | undefined = undefined
): Variable<string, O> {
  const definedOptions = options ?? ({} as O);
  const hasDefault = "default" in definedOptions;
  const { required = true, default: defaultValue } = definedOptions;

  const variable: Variable<string, O> = {
    name,
    description,
    schema: "<string>",
    required,
    hasDefault,
    default: defaultValue,

    value() {
      return result(variable);
    },

    [READ](readEnv, DEFAULT) {
      const value = readEnv(name);

      return value == "" ? DEFAULT : value;
    },
  };

  return register(variable);
}

type Options = CommonOptions<string>;
