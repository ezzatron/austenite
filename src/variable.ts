import { applyConstraints } from "./constraint.js";
import { readVariable } from "./environment.js";
import { NotSetError, SpecError, ValueError, normalize } from "./error.js";
import { type Example } from "./example.js";
import { Maybe, definedValue, map, undefinedValue } from "./maybe.js";
import { Schema } from "./schema.js";

export type VariableSpec<T> = {
  readonly name: string;
  readonly description: string;
  readonly default: Maybe<T | undefined>;
  readonly isSensitive: boolean;
  readonly schema: Schema<T>;
  readonly examples: Example<T>[];
};

export type Variable<T> = {
  readonly spec: VariableSpec<T>;
  readonly value: () => Maybe<Value<T>>;
  readonly nativeValue: () => Maybe<T>;
  readonly marshal: (value: T) => string;
  readonly unmarshal: (value: string) => T;
};

export type Value<T> = {
  readonly verbatim: string;
  readonly canonical: string;
  readonly native: T;
  readonly isDefault: boolean;
};

export type ValueOfVariable<V extends Variable<unknown>> =
  V extends Variable<infer T> ? T : never;

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

    let marshalled;

    try {
      marshalled = marshal(def.value);
    } catch (error) {
      const message = normalize(error).message;

      throw new SpecError(spec.name, new Error(`default value: ${message}`));
    }

    return definedValue({
      verbatim: marshalled,
      canonical: marshalled,
      native: def.value,
      isDefault: true,
    });
  }

  function value(): Maybe<Value<T>> {
    const { error, result } = resolve();

    if (error != null) throw error;
    return result;
  }

  function nativeValue(): Maybe<T> {
    return map(value(), (value) => value.native);
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
    // Stryker disable next-line ConditionalExpression: This is a performance optimization.
    if (resolution != null) return resolution;

    const value = readVariable(spec);

    if (value === "") {
      resolution =
        def == null ? { error: new NotSetError(spec.name) } : { result: def };
    } else {
      try {
        const native = unmarshal(value);

        resolution = {
          result: definedValue({
            verbatim: value,
            canonical: marshal(native),
            native,
            isDefault: false,
          }),
        };
      } catch (error) {
        resolution = { error: normalize(error) };
      }
    }

    return resolution;
  }

  function marshal(value: T): string {
    applyConstraints(schema.constraints, value);

    return schema.marshal(value);
  }

  function unmarshal(value: string): T {
    try {
      const native = schema.unmarshal(value);
      applyConstraints(schema.constraints, native);

      return native;
    } catch (error) {
      throw new ValueError(
        spec.name,
        spec.isSensitive,
        value,
        normalize(error),
      );
    }
  }
}
