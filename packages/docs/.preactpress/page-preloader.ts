import { readFileSync } from "node:fs";

// Embed the shared CSS at build time so first-paint feedback needs no extra request.
const loadingMotion = readFileSync(
  new URL("../src/styles/page-loading-motion.css", import.meta.url),
  "utf8",
);

/** First paint, before site CSS is ready. No browser script, external assets or fake progress. */
export const pagePreloader = `
<div id="pp-preloader" role="status" aria-live="polite" aria-label="Loading documentation"
  style="background:var(--background,var(--pp-preloader-bg));color:var(--foreground,var(--pp-preloader-accent));font-family:system-ui,sans-serif">
  <style>${loadingMotion}</style>
  <div style="width:min(28rem,calc(100% - 3rem));padding:2rem 0">
    <p style="display:flex;align-items:center;gap:.65rem;margin:0 0 1.5rem;font-size:.875rem;opacity:.7">
      <span class="page-loading-pulse" aria-hidden="true" style="width:.45rem;height:.45rem;border-radius:50%;background:var(--primary,currentColor)"></span>
      Kamod UI <span aria-hidden="true">·</span> Documentation
    </p>
    <p style="margin:0;font-size:1.65rem;line-height:1.25;font-weight:600;letter-spacing:-.035em">Opening Your Next Page…</p>
    <p style="margin:1rem 0 0;font-size:.9rem;line-height:1.7;opacity:.7">Preparing the documentation. Just a moment.</p>
    <div class="page-loading-track" aria-hidden="true" style="height:2px;margin-top:2rem;border-radius:1px;background:color-mix(in oklab,currentColor 12%,transparent)"></div>
  </div>
</div>`;
