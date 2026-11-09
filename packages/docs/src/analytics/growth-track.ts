import {
  createMatomoGrowthAdapter,
  type GrowthAnalyticsAdapter,
  noopGrowthAnalyticsAdapter,
} from "./growth-adapter";
import { shouldEmitGrowthEvent, shouldEmitGrowthEventOncePerSession } from "./growth-dedupe";
import { sanitizeGrowthMeta } from "./growth-meta";
import type { GrowthEventMeta, GrowthEventName } from "./growth-types";

const MATOMO_ENDPOINT = "https://matomo.kamod.ch/matomo.php";
const MATOMO_SITE_ID = "3";

let adapter: GrowthAnalyticsAdapter | undefined;
let adapterOverride: GrowthAnalyticsAdapter | undefined;

function resolveAdapter(): GrowthAnalyticsAdapter {
  if (adapterOverride) return adapterOverride;
  if (adapter) return adapter;
  const mode = (import.meta.env.VITE_GROWTH_ANALYTICS ?? "").trim().toLowerCase();
  if (mode === "matomo" || (import.meta.env.PROD && mode !== "noop")) {
    adapter = createMatomoGrowthAdapter({ endpoint: MATOMO_ENDPOINT, siteId: MATOMO_SITE_ID });
  } else {
    adapter = noopGrowthAnalyticsAdapter;
  }
  return adapter;
}

/** Test-only: inject a mock adapter. */
export function setGrowthAnalyticsAdapterForTests(next: GrowthAnalyticsAdapter | null) {
  adapterOverride = next ?? undefined;
}

export function trackGrowthEvent(
  name: GrowthEventName,
  meta: GrowthEventMeta = {},
  options?: { dedupeKey?: string; oncePerSession?: boolean },
) {
  if (typeof window === "undefined") return;
  const safe = sanitizeGrowthMeta(meta);
  const dedupeKey =
    options?.dedupeKey ??
    `${name}|${safe.location ?? ""}|${safe.exampleId ?? ""}|${safe.templateId ?? ""}|${safe.displayMode ?? ""}`;
  if (options?.oncePerSession) {
    if (!shouldEmitGrowthEventOncePerSession(dedupeKey)) return;
  } else if (!shouldEmitGrowthEvent(dedupeKey)) {
    return;
  }
  try {
    resolveAdapter().track(name, safe);
  } catch {
    /* navigation and clipboard must not depend on analytics */
  }
}
