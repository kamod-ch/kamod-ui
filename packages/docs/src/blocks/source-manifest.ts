/** Resolve a displayed file through its registry path; a missing source is an actionable error. */
export function sourceFromManifest(
  files: readonly { path: string; label: string }[],
  label: string,
  sources: Record<string, string>,
): string {
  const file = files.find((entry) => entry.label === label);
  const source = file && sources[`../../../blocks/${file.path}`];
  if (source === undefined) throw new Error(`Block source not found: ${label}`);
  return source;
}
