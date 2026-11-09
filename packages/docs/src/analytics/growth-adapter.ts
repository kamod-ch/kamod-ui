import { sanitizeGrowthMeta } from "./growth-meta";
import type { GrowthEventMeta, GrowthEventName } from "./growth-types";

export type GrowthAnalyticsAdapter = {
  track: (name: GrowthEventName, meta: GrowthEventMeta) => void;
};

export const noopGrowthAnalyticsAdapter: GrowthAnalyticsAdapter = {
  track() {},
};

export type MatomoGrowthAdapterOptions = {
  endpoint: string;
  siteId: string;
};

/** Matomo event via tracking pixel — same host as the existing docs page tracker. */
export function createMatomoGrowthAdapter({
  endpoint,
  siteId,
}: MatomoGrowthAdapterOptions): GrowthAnalyticsAdapter {
  return {
    track(name, rawMeta) {
      if (typeof Image === "undefined") return;
      const meta = sanitizeGrowthMeta(rawMeta);
      const params = new URLSearchParams({
        idsite: siteId,
        rec: "1",
        e_c: "kamod_docs_growth",
        e_a: name,
      });
      const labelParts: string[] = [];
      if (meta.templateId) labelParts.push(`template:${meta.templateId}`);
      if (meta.exampleId) labelParts.push(`example:${meta.exampleId}`);
      if (meta.displayMode) labelParts.push(`mode:${meta.displayMode}`);
      if (labelParts.length) params.set("e_n", labelParts.join("|").slice(0, 500));
      if (meta.location) params.set("dimension1", meta.location);
      if (meta.exampleId) params.set("dimension2", meta.exampleId.slice(0, 200));
      if (meta.displayMode) params.set("dimension3", meta.displayMode.slice(0, 80));

      const img = new Image(1, 1);
      img.referrerPolicy = "no-referrer-when-downgrade";
      img.alt = "";
      img.src = `${endpoint}?${params.toString()}`;
    },
  };
}
