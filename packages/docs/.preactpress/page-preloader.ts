/** First paint, before site CSS is ready. No script, external assets or fake progress. */
export const pagePreloader = `
<div id="pp-preloader" role="status" aria-live="polite" aria-label="Loading documentation"
  style="background:var(--background,var(--pp-preloader-bg));color:var(--foreground,var(--pp-preloader-accent));font-family:system-ui,sans-serif">
  <div style="width:min(28rem,calc(100% - 3rem));padding:2rem 0">
    <p style="display:flex;align-items:center;gap:.65rem;margin:0 0 1.5rem;font-size:.875rem;opacity:.7">
      <span aria-hidden="true" style="width:.45rem;height:.45rem;border-radius:50%;background:currentColor"></span>
      Kamod UI <span aria-hidden="true">·</span> Documentation
    </p>
    <p style="margin:0;font-size:1.65rem;line-height:1.25;font-weight:600;letter-spacing:-.035em">Opening Your Next Page…</p>
    <p style="margin:1rem 0 0;font-size:.9rem;line-height:1.7;opacity:.7">Preparing the documentation. Just a moment.</p>
    <div aria-hidden="true" style="height:1px;margin-top:2rem;background:currentColor;opacity:.12"></div>
  </div>
</div>`;
