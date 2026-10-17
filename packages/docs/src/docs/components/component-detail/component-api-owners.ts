/** Shared by page tables and build-backed miniature tables; no runtime metadata loader is needed. */
export function apiTableOwner<T extends { name: string }>(entries: readonly T[], title: string) {
  const name = title.replace(/\s+(props|api|reference)$/i, "").replace(/[^a-z0-9]/gi, "");
  return entries.find((entry) => entry.name.toLowerCase() === `${name}Props`.toLowerCase());
}

/** Qualified rows name their helpers; unqualified rows inherit the table's declared owner. */
export function apiTableRowOwners<T extends { name: string }>(
  entries: readonly T[],
  title: string,
  prop: string,
) {
  const qualifiers = prop.split(/\s+/).slice(0, -1);
  const matches = entries.filter(
    ({ name }) => name.endsWith("Props") && qualifiers.includes(name.replace(/Props$/, "")),
  );
  const fallback = apiTableOwner(entries, title);
  return matches.length ? matches : fallback ? [fallback] : [];
}
