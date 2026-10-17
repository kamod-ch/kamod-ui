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
  <div class="page-state-message">
    <p class="page-loading-label page-state-message-label">
      <span class="page-loading-brand"><span class="page-loading-spinner" aria-hidden="true"></span><strong>Kamod</strong></span>
      <span aria-hidden="true">·</span>
      <span>Your next page is taking shape</span>
    </p>
    <p class="page-state-message-title">Opening Your Next <span class="page-loading-ending">Page<span class="page-loading-ellipsis" aria-hidden="true"><i></i><i></i><i></i></span><span class="page-loading-ellipsis-label">…</span></span></p>
    <p class="page-loading-description page-state-message-description">Preparing the documentation. Just a moment.</p>
    <div class="page-loading-track" aria-hidden="true"></div>
  </div>
</div>`;
