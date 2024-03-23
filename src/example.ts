export type Example = {
  readonly value: string;
  readonly description: string;
};

export type Examples = Iterable<Example>;

export function create(...init: (Example | undefined)[]): Examples {
  const seen = new Set();
  const examples: Example[] = [];

  for (const example of init) {
    if (example == null || seen.has(example.value)) continue;
    seen.add(example.value);
    examples.push(example);
  }

  return examples;
}
