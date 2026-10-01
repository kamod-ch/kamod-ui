/** Installation paths shared by source headers, API references and assistant prompts. */
export function blockSourceDestination(
  block: { category: string; id: string },
  file: { path: string; label: string },
) {
  if (block.category === "sidebar") return `src/components/blocks/${block.id}/${file.label}`;
  if (block.category === "application-shell") return `src/components/${block.id}/${file.label}`;
  return `src/components/blocks/${file.path.replace(/^src\//, "")}`;
}

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
