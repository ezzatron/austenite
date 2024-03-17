export function createDisjunctionFormatter(): Intl.ListFormat {
  return new Intl.ListFormat("en", {
    style: "short",
    type: "disjunction",
  });
}
