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
    <p class="page-loading-label" style="margin:0 0 1.5rem">
      <span class="page-loading-brand"><span class="page-loading-spinner" aria-hidden="true"></span><strong>Kamod</strong></span>
      <span aria-hidden="true">·</span>
      <span>Your next page is taking shape</span>
    </p>
    <p style="margin:0;font-size:1.65rem;line-height:1.25;font-weight:600;letter-spacing:-.035em">Opening Your Next <span class="page-loading-ending">Page<span class="page-loading-ellipsis" aria-hidden="true"><i></i><i></i><i></i></span><span class="page-loading-ellipsis-label">…</span></span></p>
    <p class="page-loading-description" style="margin:1rem 0 0;font-size:.9rem;line-height:1.7">Preparing the documentation. Just a moment.</p>
    <div class="page-loading-track" aria-hidden="true" style="height:4px;margin-top:2rem;border-radius:999px;background:color-mix(in oklab,currentColor 12%,transparent)"></div>
  </div>
</div>`;
