/** Build-time source metadata; declarations are never parsed in the browser. */
export type ComponentTypeDefinition = {
  name: string;
  source: string;
  filePath: string;
  exported: boolean;
  description: string;
  fields: { name: string; type: string; required: boolean; description: string }[];
};

const sources = import.meta.glob<ComponentTypeDefinition[]>(
  [
    "../../../../../core/src/components/**/*.{ts,tsx}",
    "../../forms/formisch/*.{ts,tsx}",
    "!**/*.test.*",
    "!**/* 2.*",
  ],
  { query: "?component-api", import: "default", eager: true },
);

const catalog = new Map<string, ComponentTypeDefinition[]>();
for (const [path, entries] of Object.entries(sources)) {
  const slug = path.includes("/forms/formisch/")
    ? "formisch"
    : path.split("/components/")[1]?.split("/")[0];
  if (slug && entries.length) catalog.set(slug, [...(catalog.get(slug) ?? []), ...entries]);
}

const emptyTypes: ComponentTypeDefinition[] = [];
export const componentApiTypes = (slug: string) => catalog.get(slug) ?? emptyTypes;
export const componentTypeId = (entry: ComponentTypeDefinition) =>
  `component-type-${entry.filePath
    .split("/")
    .at(-1)!
    .replace(/\.[^.]+$/, "")}-${entry.name}`;

/** Match only a named owner's declared fields; inherited props are not inferred from defaults. */
export function componentApiOwner(slug: string, title: string) {
  const name = title.replace(/\s+(props|api|reference)$/i, "").replace(/[^a-z0-9]/gi, "");
  return componentApiTypes(slug).find(
    (entry) => entry.name.toLowerCase() === `${name}Props`.toLowerCase(),
  );
}
