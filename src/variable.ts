import { applyConstraints } from "./constraint.js";
import { readVariable } from "./environment.js";
import { normalize } from "./error.js";
import { Examples } from "./example.js";
import { Maybe, definedValue, map, undefinedValue } from "./maybe.js";
import { Schema } from "./schema.js";
import { quote } from "./shell.js";

export type VariableSpec<T> = {
  readonly name: string;
  readonly description: string;
  readonly default: Maybe<T | undefined>;
  readonly isSensitive: boolean;
  readonly schema: Schema<T>;
  readonly examples: Examples;
};

export type Variable<T> = {
  readonly spec: VariableSpec<T>;
  value(): Maybe<Value<T>>;
  nativeValue(): Maybe<T>;
  marshal(value: T): string;
  unmarshal(value: string): T;
};

export type Value<T> = {
  readonly verbatim: string;
  readonly canonical: string;
  readonly native: T;
  readonly isDefault: boolean;
};

export function create<T>(spec: VariableSpec<T>): Variable<T> {
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
    if (result.isDefined) return definedValue(result.value);

    return undefinedValue();
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

export class SpecError extends Error {
  constructor(
    public readonly name: string,
    public readonly cause: Error,
  ) {
    super(`specification for ${name} is invalid: ${cause.message}`);
  }
}

export class ValueError extends Error {
  constructor(
    public readonly name: string,
    public readonly isSensitive: boolean,
    public readonly value: string,
    public readonly cause: Error,
  ) {
    const renderedValue = isSensitive ? "<sensitive value>" : quote(value);

    super(`value of ${name} (${renderedValue}) is invalid: ${cause.message}`);
  }
}

export class NotSetError extends Error {
  constructor(public readonly name: string) {
    super(`${name} is not set and does not have a default value`);
  }
}
