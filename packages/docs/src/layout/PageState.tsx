import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  HouseIcon,
  RotateCcwIcon,
  RouteIcon,
} from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import type { ComponentChildren } from "preact";
import { withBasePath } from "../base-path";
import { KamodUiBrandLogo } from "./KamodUiBrandLogo";

/** Deliberately independent of the demo registry: recovery must load with the router. */
function PageStateFrame({
  children,
  notFound = false,
}: {
  children: ComponentChildren;
  notFound?: boolean;
}) {
  return (
    <div class={`page-state-shell${notFound ? " page-state-shell--not-found" : ""}`}>
      <header class="page-state-topbar">
        <a class="page-state-brand" href={withBasePath("/")} aria-label="Kamod UI home">
          <KamodUiBrandLogo />
        </a>
        <a class="page-state-text-link" href={withBasePath("/docs/getting-started")}>
          Get Started <ArrowRightIcon size={16} aria-hidden="true" />
        </a>
      </header>
      <main class="page-state-main" id="content" tabIndex={-1}>
        {children}
      </main>
      <footer class="page-state-footer">
        <span>Made for Preact. Built to be yours.</span>
        <a href="https://github.com/kamod-ch/kamod-ui">
          <BrandGithubIcon size={14} aria-hidden="true" />
          Explore the Source <ArrowRightIcon size={14} aria-hidden="true" />
        </a>
      </footer>
    </div>
  );
}

/** A standalone recovery page, with no demo registry or browser-only state. */
export function PageNotFound() {
  return (
    <PageStateFrame notFound>
      <section class="not-found-hero" aria-labelledby="page-state-title">
        <p class="not-found-status" aria-hidden="true">
          404
        </p>
        <div class="not-found-copy">
          <h1 id="page-state-title">Page not found</h1>
          <p class="not-found-description">We couldn’t find that page.</p>
          <nav class="not-found-actions" aria-label="Page recovery">
            <a class="not-found-home" href={withBasePath("/")}>
              <HouseIcon size={15} aria-hidden="true" />
              Back to Home
            </a>
            <a class="not-found-guide" href={withBasePath("/docs/getting-started")}>
              Getting Started <ArrowRightIcon size={14} aria-hidden="true" />
            </a>
          </nav>
        </div>
      </section>
    </PageStateFrame>
  );
}

export function PageLoading({ compact = false }: { compact?: boolean }) {
  const content = (
    <section
      class={`page-state-loading${compact ? " page-state-loading--compact" : ""}`}
      aria-label="Loading content"
      aria-busy="true"
    >
      <div role="status" aria-live="polite" aria-atomic="true">
        <p class="page-state-eyebrow page-loading-label">
          <span class="page-loading-brand">
            <span class="page-loading-spinner" aria-hidden="true" />
            <strong>Kamod</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {compact ? "Preparing your interactive preview" : "Your next page is taking shape"}
          </span>
        </p>
        <h1 aria-label={compact ? "Loading Preview…" : "Opening Your Next Page…"}>
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
        </h1>
        <p class="page-state-description page-loading-description">
          {compact
            ? "Preparing the interactive example."
            : "Loading the guide and preparing its examples for you to explore. The page will appear here automatically when it’s ready, so you can keep this view open without refreshing."}
        </p>
      </div>
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
    </section>
  );
  return compact ? content : <PageStateFrame>{content}</PageStateFrame>;
}

/** A static first-paint-sized message; a full reload also clears a rejected lazy import. */
export function PageLoadError({ compact = false }: { compact?: boolean }) {
  const Shell = compact ? "div" : "main";
  return (
    <Shell
      class={`page-state-recovery${compact ? " page-state-recovery--compact" : ""}`}
      id={compact ? undefined : "content"}
      tabIndex={compact ? undefined : -1}
    >
      <section class="page-state-message" role="alert">
        <p class="page-state-message-label">
          <span class="page-state-message-brand">
            <RouteIcon size={18} aria-hidden="true" />
            <strong>Kamod</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>Loading interrupted</span>
        </p>
        <h1 class="page-state-message-title">Let’s Try That Again.</h1>
        <p class="page-state-message-description">
          Something interrupted this {compact ? "preview" : "page"} before it was ready. Check your
          connection, then try loading it again.
          {!compact && " You can also head home and pick up from there."}
        </p>
        <div class="page-recovery-actions">
          <button class="page-recovery-link" type="button" onClick={() => window.location.reload()}>
            <RotateCcwIcon size={14} aria-hidden="true" />
            <span>Reload Page</span>
            <ArrowRightIcon size={12} aria-hidden="true" />
          </button>
          {!compact && (
            <>
              <span class="page-recovery-action-divider" aria-hidden="true">
                /
              </span>
              <a class="page-recovery-link" href={withBasePath("/")}>
                <HouseIcon size={14} aria-hidden="true" />
                <span>Back to Home</span>
                <ArrowUpRightIcon size={12} aria-hidden="true" />
              </a>
            </>
          )}
        </div>
        <hr class="page-recovery-divider" />
      </section>
    </Shell>
  );
}
