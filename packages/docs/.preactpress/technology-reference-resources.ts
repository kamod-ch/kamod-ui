import type { TechnologySnapshot } from "./technology-reference-snapshots";
import { technologySnapshots } from "./technology-reference-snapshots";

/** Saved official continuations are data, not instructions to contact those websites. */
export function technologyReferenceResources(
  name: string,
  saved = technologySnapshots(),
): TechnologySnapshot["resources"] {
  return Object.hasOwn(saved, name) ? saved[name].resources : [];
}
