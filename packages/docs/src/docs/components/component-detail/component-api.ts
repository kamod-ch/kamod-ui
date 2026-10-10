/** Build-time source metadata; declarations are never parsed in the browser. */
import { loaders, sources } from "virtual:kamod-component-api";

export type ComponentTypeDefinition = {
  name: string;
  source: string;
  filePath: string;
  exported: boolean;
  description: string;
  fields: { name: string; type: string; required: boolean; description: string }[];
};

const catalog = new Map<string, ComponentTypeDefinition[]>(Object.entries(sources));
const pending = new Map<string, Promise<void>>();

/** Load before rendering an article; standalone previews never request documentation metadata. */
export function loadComponentApi(slug: string): Promise<void> {
  if (catalog.has(slug) || !loaders[slug]) return Promise.resolve();
  const existing = pending.get(slug);
  if (existing) return existing;
  const request = loaders[slug]()
    .then((entries) => {
      catalog.set(slug, entries);
    })
    .finally(() => {
      pending.delete(slug);
    });
  pending.set(slug, request);
  return request;
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

/** Qualified rows name their own helpers; unqualified rows inherit the section's owner. */
export function componentApiRowOwners(slug: string, title: string, prop: string) {
  const qualifiers = prop.split(/\s+/).slice(0, -1);
  const matches = componentApiTypes(slug).filter(
    ({ name }) => name.endsWith("Props") && qualifiers.includes(name.replace(/Props$/, "")),
  );
  const fallback = componentApiOwner(slug, title);
  return matches.length ? matches : fallback ? [fallback] : [];
}
