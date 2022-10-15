import { quote } from "shell-quote";
import { readVariable } from "./environment";
import { normalizeError } from "./error";
import { Examples } from "./example";
import { definedValue, mapMaybe, Maybe, undefinedValue } from "./maybe";
import { Schema } from "./schema";

export interface VariableSpec<T> {
  readonly name: string;
  readonly description: string;
  readonly default: Maybe<T | undefined>;
  readonly schema: Schema<T>;
  readonly examples: Examples<T>;
  readonly constraint?: Constraint<T>;
}

export type Constraint<T> = (spec: VariableSpec<T>, value: T) => void;

export interface Variable<T> {
  readonly spec: VariableSpec<T>;
  value(): Maybe<Value<T>>;
  nativeValue(): Maybe<T>;
  marshal(value: T): string;
  unmarshal(value: string): T;
}

export interface Value<T> {
  readonly verbatim: string;
  readonly native: T;
  readonly isDefault: boolean;
}

export function createVariable<T>(spec: VariableSpec<T>): Variable<T> {
  const { schema } = spec;
  const def = defaultValue();
  let resolution: Resolution<T>;

  return {
    spec,
    value,
    nativeValue,
    marshal,
    unmarshal,
  };

  function defaultValue(): Maybe<Value<T>> | undefined {
    const { default: def } = spec;

    if (!def.isDefined) return undefined;
    if (typeof def.value === "undefined") return undefinedValue();

    try {
      return definedValue({
        verbatim: marshal(def.value),
        native: def.value,
        isDefault: true,
      });
    } catch (error) {
      const message = normalizeError(error).message;

      throw new SpecError(spec.name, new Error(`default value: ${message}`));
    }
  }

  function value(): Maybe<Value<T>> {
    const { error, result } = resolve();

    if (error != null) throw error;
    if (result.isDefined) return definedValue(result.value);

    return undefinedValue();
  }

  function nativeValue(): Maybe<T> {
    return mapMaybe(value(), (value) => value.native);
  }

  type Resolution<T> =
    | {
        readonly result: Maybe<Value<T>>;
        readonly error?: never;
      }
    | {
        readonly result?: never;
        readonly error: Error;
      };

  function resolve(): Resolution<T> {
    if (resolution != null) return resolution;

    const value = readVariable(spec);

    if (value === "") {
      resolution =
        def == null
          ? { error: new UndefinedError(spec.name) }
          : { result: def };
    } else {
      try {
        resolution = {
          result: definedValue({
            verbatim: value,
            native: unmarshal(value),
            isDefault: false,
          }),
        };
      } catch (error) {
        resolution = { error: normalizeError(error) };
      }
    }

    return resolution;
  }

  function marshal(value: T): string {
    spec.constraint?.(spec, value);

    return schema.marshal(value);
  }

  function unmarshal(value: string): T {
    try {
      const native = schema.unmarshal(value);
      spec.constraint?.(spec, native);
      // TODO: canonicalize

      return native;
    } catch (error) {
      throw new ValueError(spec.name, value, normalizeError(error));
    }
  }
}

export class SpecError extends Error {
  constructor(public readonly name: string, public readonly cause: Error) {
    super(`specification for ${name} is invalid: ${cause.message}`);
  }
}

export class ValueError extends Error {
  constructor(
    public readonly name: string,
    public readonly value: string,
    public readonly cause: Error
  ) {
    super(`value of ${name} (${quote([value])}) is invalid: ${cause.message}`);
  }
}

export class UndefinedError extends Error {
  constructor(public readonly name: string) {
    super(`${name} is undefined and does not have a default value`);
  }
}
