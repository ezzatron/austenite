import { applyConstraints } from "./constraint.js";
import { SpecError, normalize } from "./error.js";
import type { Schema } from "./schema.js";

export type DeclarationExampleOptions<T> = {
  readonly examples?: Example<T>[];
};

export type Example<T> = {
  readonly value: T;
  readonly as?: string;
  readonly label: string;
};

export function resolveExamples<T>(
  name: string,
  { constraints, marshal, unmarshal }: Schema<T>,
  buildExamples: () => Example<T>[],
  examples?: Example<T>[],
): Example<T>[] {
  const isSpecified = Boolean(examples);
  const resolved = examples ?? buildExamples();

  for (const { label, value, as } of resolved) {
    try {
      applyConstraints(constraints, value);
    } catch (error) {
      if (isSpecified) {
        throw new InvalidValueError(name, label, normalize(error));
      } else {
        throw new MustProvideExamplesError(name);
      }
    }

    if (typeof as !== "string") continue;

    try {
      const native = unmarshal(as);
      applyConstraints(constraints, native);

      if (marshal(native) !== marshal(value)) throw new Error("value mismatch");
    } catch (error) {
      throw new InvalidAsError(name, label, as, normalize(error));
    }
  }

  if (resolved.length < 1) throw new MustProvideExamplesError(name);

  return resolved;
}

class MustProvideExamplesError extends SpecError {
  constructor(name: string) {
    super(name, new Error("examples must be provided"));
  }
}

class InvalidValueError extends SpecError {
  constructor(name: string, label: string, cause: Error) {
    const quotedLabel = JSON.stringify(label);

    super(name, new Error(`example ${quotedLabel}: value ${cause.message}`));
  }
}

class InvalidAsError extends SpecError {
  constructor(name: string, label: string, as: string, cause: Error) {
    const quotedLabel = JSON.stringify(label);

    super(
      name,
      new Error(
        `example ${quotedLabel}: ` +
          `value can't be expressed as ${JSON.stringify(as)}: ${cause.message}`,
      ),
    );
  }
}
