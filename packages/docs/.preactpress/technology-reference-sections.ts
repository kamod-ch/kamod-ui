import { foundationSections } from "../src/references/catalog/technology-foundations";
import { integrationSections } from "../src/references/catalog/technology-integrations";
import { librarySections } from "../src/references/catalog/technology-libraries";
import { toolingSections } from "../src/references/catalog/technology-tooling";

const sections = {
  ...foundationSections,
  ...toolingSections,
  ...librarySections,
  ...integrationSections,
};

/** Build-only: saved technology chapters go into the lazy family, never the eager alias index. */
export function technologyReferenceSections(name: string, href: string) {
  const profile = Object.hasOwn(sections, name) ? sections[name] : undefined;
  if (!profile) throw new Error(`Missing saved technology reference sections: ${name}`);
  return profile.map((section) => ({
    ...section,
    source: section.source ?? { label: `${name}: ${section.title}`, href },
  }));
}
