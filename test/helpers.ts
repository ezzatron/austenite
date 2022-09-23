export type HasType<Expected, Actual> = [Expected] extends [Actual]
  ? [Actual] extends [Expected]
    ? Expected
    : never
  : never;

export function hasType<Expected, Actual>(_: HasType<Expected, Actual>): null {
  return null;
}
