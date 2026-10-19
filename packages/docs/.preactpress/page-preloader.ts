import { readFileSync } from "node:fs";
import { h } from "preact";
import { renderToString } from "preact-render-to-string";
import { PageOpening } from "../src/layout/PageOpening";

// Embed the same layout, logo, skeleton and flight styles before any client request completes.
const loadingStyles = [
  "site-brand.css",
  "page-loading-motion.css",
  "loading-skeleton-motion.css",
  "getting-started-flight.css",
  "page-opening.css",
]
  .map((file) => readFileSync(new URL(`../src/styles/${file}`, import.meta.url), "utf8"))
  .join("\n");

/** One design for first paint and route loading. Readiness/no-script behavior stays with PreactPress. */
export function createPagePreloader(base: string) {
  return `<div id="pp-preloader" role="status" aria-live="polite" aria-label="Loading documentation">
<style>${loadingStyles}</style>
${renderToString(h(PageOpening, { base, startup: true }))}
</div>`;
}
