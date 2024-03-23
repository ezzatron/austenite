export function createConjunctionFormatter(): Intl.ListFormat {
  return new Intl.ListFormat("en");
}

export function createDisjunctionFormatter(): Intl.ListFormat {
  return new Intl.ListFormat("en", { type: "disjunction" });
}
