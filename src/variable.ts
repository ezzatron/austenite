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
  };

  function defaultValue(): Maybe<Value<T>> | undefined {
    const { default: def } = spec;

    if (!def.isDefined) return undefined;
    if (typeof def.value === "undefined") return undefinedValue();

    return definedValue({
      verbatim: marshal(def.value),
      native: def.value,
      isDefault: true,
    });
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
    let r: Resolution<T>;

    if (value === "") {
      r = def == null ? { error: new Error("undefined") } : { result: def };
    } else {
      try {
        r = {
          result: definedValue({
            verbatim: value,
            native: unmarshal(value),
            isDefault: false,
          }),
        };
      } catch (error) {
        r = { error: normalizeError(error) };
      }
    }

    return r;
  }

  function marshal(value: T): string {
    spec.constraint?.(spec, value);

    return schema.marshal(value);
  }

  function unmarshal(value: string): T {
    const native = schema.unmarshal(value);
    spec.constraint?.(spec, native);
    // TODO: canonicalize

    return native;
  }
}
