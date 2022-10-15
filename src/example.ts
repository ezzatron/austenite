export interface Example {
  readonly canonical: string;
  readonly description: string;
}

export type Examples = Iterable<Example>;

export function createExamples(...init: (Example | undefined)[]): Examples {
  const seen = new Set();
  const examples: Example[] = [];

  for (const example of init) {
    if (example == null || seen.has(example.canonical)) continue;
    seen.add(example.canonical);
    examples.push(example);
  }

  return examples;
}
