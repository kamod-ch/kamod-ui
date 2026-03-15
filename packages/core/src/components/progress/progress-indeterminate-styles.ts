const STYLE_ID = "kamod-ui-progress-indeterminate";

const indeterminateKeyframesCss = `@keyframes kamod-progress-indeterminate{0%{transform:translateX(-100%)}100%{transform:translateX(270%)}}[data-slot="progress"][data-state="indeterminate"] [data-slot="progress-indicator"]{animation:kamod-progress-indeterminate 1.2s ease-in-out infinite}@media (prefers-reduced-motion:reduce){[data-slot="progress"][data-state="indeterminate"] [data-slot="progress-indicator"]{animation:none}}`;

function injectProgressIndeterminateStyles(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = indeterminateKeyframesCss;
  document.head.appendChild(style);
}

injectProgressIndeterminateStyles();
