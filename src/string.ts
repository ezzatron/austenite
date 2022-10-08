import { register, result } from "./environment";
import { Example } from "./example";
import { createString } from "./schema";
import { Options as CommonOptions, READ, Variable } from "./variable";

type Options = CommonOptions<string>;

export function string<O extends Options>(
  name: string,
  description: string,
  options: O | undefined = undefined
): Variable<string, O> {
  const definedOptions = options ?? ({} as O);
  const hasDefault = "default" in definedOptions;
  const { required = true, default: defaultValue } = definedOptions;
  const schema = createString();

  const examples: Example[] = hasDefault
    ? [{ value: defaultValue as string }]
    : schema.examples();

  const variable: Variable<string, O> = {
    name,
    description,
    schema,
    required,
    hasDefault,
    default: defaultValue,
    examples,

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
