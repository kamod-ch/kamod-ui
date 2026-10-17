/** Split without normalizing: separators, relative prefixes and trailing slashes remain copyable. */
export function splitDisplayPath(path: string) {
  const root = path.match(/^(?:[\\/]+|(?:\.{1,2}|[A-Za-z]:)[\\/]+)?[^\\/]+[\\/]+/)?.[0] ?? "";
  const endIndex = path.replace(/[\\/]+$/, "").search(/[\\/][^\\/]*$/);
  if (!root || endIndex < root.length) return { root, middle: "", end: path.slice(root.length) };
  return { root, middle: path.slice(root.length, endIndex), end: path.slice(endIndex) };
}
