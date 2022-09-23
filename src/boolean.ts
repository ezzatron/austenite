import { UndefinedError } from "./errors";
import { Options } from "./options";
import { Variable } from "./variable";

export function boolean<O extends Options<boolean>>(
  name: string,
  _description: string,
  options: O | undefined = undefined
): Variable<boolean, O> {
  const { default: d, required = true } = options ?? {};

  return {
    value() {
      const v = process.env[name];

      if (typeof v === "string" && v != "") {
        if (v === "true") return true;
        if (v === "false") return false;
        throw new InvalidBooleanError(name, v);
      }

      if (required && d == null) throw new UndefinedError(name);

      return d;
    },
  } as Variable<boolean, O>;
}

class InvalidBooleanError extends Error {
  constructor(name: string, value: string) {
    const quotedValue = JSON.stringify(value);

    super(
      `The value of ${name} (${quotedValue}) is invalid: expected either "true" or "false".`
    );
  }
}
