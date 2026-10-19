import { technologySnapshots } from "./technology-reference-snapshots";

/** Build-only: saved chapters enter the lazy family, never the eager alias index. */
export function technologyReferenceSections(
  name: string,
  href: string,
  saved = technologySnapshots(),
) {
  const profile = Object.hasOwn(saved, name) ? saved[name].sections : undefined;
  if (!profile) throw new Error(`Missing saved technology reference sections: ${name}`);
  return profile.map((section) => ({
    ...section,
    source: section.source ?? { label: `${name}: ${section.title}`, href },
    excerpts: section.excerpts?.map((excerpt) => ({
      ...excerpt,
      source: excerpt.source ?? section.source ?? { label: `${name}: ${section.title}`, href },
    })),
  }));
}
