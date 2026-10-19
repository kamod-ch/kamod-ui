/** @jsxImportSource preact */
import { ZapIcon } from "@kamod-ch/icons/lucide";
import Logo from "../../.preactpress/theme/Logo";
import { GettingStartedRocket } from "../docs/components/GettingStartedRocket";

/** Shared by first paint and route loading; no Vite environment or page registry dependency. */
export function PageOpening({
  base = "/",
  compact = false,
  startup = false,
}: {
  base?: string;
  compact?: boolean;
  startup?: boolean;
}) {
  // The startup overlay stays outside the app after readiness. Omit runtime landmarks/IDs
  // and its h1 so it cannot become a second page title or match route-state selectors.
  const Title = startup ? "p" : "h1";
  const Main = startup ? "div" : "main";
  const Header = startup ? "div" : "header";
  const content = (
    <section
      class={`page-opening-content${startup ? "" : " page-state-loading"}${compact ? " page-state-loading--compact" : ""}`}
      aria-label={startup ? undefined : "Loading content"}
      aria-busy="true"
    >
      <div
        class="page-opening-copy"
        role={startup ? undefined : "status"}
        aria-live={startup ? undefined : "polite"}
        aria-atomic="true"
      >
        <p class="page-state-eyebrow page-loading-label">
          <span class="page-loading-brand">
            <strong>Kamod</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span class="page-loading-caption">
            {compact
              ? "Preparing your interactive preview..."
              : "Your next page is taking shape..."}
          </span>
        </p>
        <Title
          class="page-loading-title"
          aria-label={compact ? "Loading Preview…" : "Opening Your Next Page…"}
        >
          {compact ? "Loading " : "Opening Your Next "}
          <span class="page-loading-ending">
            {compact ? "Preview" : "Page"}
            <span class="page-loading-ellipsis" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span class="page-loading-ellipsis-label">…</span>
          </span>
        </Title>
        <p class="page-state-description page-loading-description">
          {compact
            ? "Preparing the interactive example."
            : "Loading the guide and preparing its examples for you to explore. The page will appear here automatically when it’s ready, so you can keep this view open without refreshing."}
        </p>
      </div>
      <div class="page-opening-preview">
        <div class="page-state-skeleton docs-loading-skeleton" aria-hidden="true">
          <span class="page-loading-track docs-loading-shape" />
          <span class="docs-loading-shape" />
          <span class="docs-loading-shape" />
          <div class="page-loading-panel">
            <div class="page-loading-panel-header">
              <span class="page-loading-panel-icon docs-loading-shape" />
              <div class="page-loading-panel-lines">
                <span class="docs-loading-shape" />
                <span class="docs-loading-shape" />
              </div>
              <span class="page-loading-panel-action docs-loading-shape" />
            </div>
            <span class="page-loading-panel-line docs-loading-shape" />
            <span class="page-loading-panel-line docs-loading-shape" />
            <div class="page-loading-panel-footer">
              <span class="docs-loading-shape" />
              <span class="docs-loading-shape" />
              <span class="docs-loading-shape" />
            </div>
          </div>
        </div>
        {!compact && (
          <p class="page-loading-tagline">
            <ZapIcon size={14} stroke-width={1.5} aria-hidden="true" />
            Made for Preact. Built to be yours.
          </p>
        )}
      </div>
    </section>
  );
  if (compact) return content;
  return (
    <div
      class={`page-opening${startup ? " page-opening--startup" : " page-state-shell page-state-shell--loading"}`}
    >
      <Header class={`page-opening-topbar${startup ? "" : " page-state-topbar"}`}>
        <a class="page-state-brand" href={base} aria-label="Kamod UI home">
          <Logo base={base} />
        </a>
      </Header>
      <div class="page-loading-rocket">
        <GettingStartedRocket />
      </div>
      <Main
        class={`page-opening-main${startup ? "" : " page-state-main"}`}
        id={startup ? undefined : "content"}
        tabIndex={startup ? undefined : -1}
      >
        {content}
      </Main>
    </div>
  );
}
