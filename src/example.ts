import { applyConstraints } from "./constraint.js";
import type { Schema } from "./schema.js";

export type Example = {
  readonly value: string;
  readonly description: string;
};

export function removeInvalidExamples<T>(
  schema: Schema<T>,
  examples: Example[],
): Example[] {
  const filtered: Example[] = [];

  for (const example of examples) {
    try {
      applyConstraints(schema.constraints, schema.unmarshal(example.value));
    } catch {
      continue;
    }

    filtered.push(example);
  }

  return filtered;
}
