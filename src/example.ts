export interface Example<T> {
  readonly canonical: string;
  readonly native: T;
  readonly description: string;
}

export type Examples<T> = Iterable<Example<T>>;

export function createExamples<T>(
  ...init: (Example<T> | undefined)[]
): Examples<T> {
  const seen = new Set();
  const examples: Example<T>[] = [];

  for (const example of init) {
    if (example == null || seen.has(example.canonical)) continue;
    seen.add(example.canonical);
    examples.push(example);
  }

  return examples;
}
