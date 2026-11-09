import type { GrowthEventMeta } from "./growth-types";

const DEMO_ENTRY_KEY = "kamod:demo-entry-location";

export function markDemoEntryLocation(location: GrowthEventMeta["location"]) {
  if (typeof sessionStorage === "undefined" || !location) return;
  try {
    sessionStorage.setItem(DEMO_ENTRY_KEY, location);
  } catch {
    /* storage blocked */
  }
}

export function consumeDemoEntryLocation(): GrowthEventMeta["location"] | undefined {
  if (typeof sessionStorage === "undefined") return undefined;
  try {
    const value = sessionStorage.getItem(DEMO_ENTRY_KEY);
    sessionStorage.removeItem(DEMO_ENTRY_KEY);
    if (
      value === "header" ||
      value === "landing" ||
      value === "post_copy" ||
      value === "post_download"
    ) {
      return value;
    }
  } catch {
    /* storage blocked */
  }
  return undefined;
}

export function stableExampleId(
  filePath?: string,
  slug?: string,
  index?: number,
): string | undefined {
  if (filePath) return filePath.replace(/^@\//, "").replace(/^\//, "");
  if (slug != null && index != null) return `${slug}-example-${index + 1}`;
  if (slug) return slug;
  return undefined;
}

export function sanitizeGrowthMeta(meta: GrowthEventMeta = {}): GrowthEventMeta {
  const next: GrowthEventMeta = {};
  if (meta.location) next.location = meta.location;
  if (meta.templateId) next.templateId = meta.templateId.slice(0, 120);
  if (meta.displayMode) next.displayMode = meta.displayMode.slice(0, 80);
  if (meta.exampleId) {
    const id = meta.exampleId.slice(0, 200);
    if (!id.includes("?")) next.exampleId = id;
  }
  return next;
}
