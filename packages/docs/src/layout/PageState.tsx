import { ArrowRightIcon, ArrowUpRightIcon, HouseIcon, RotateCcwIcon } from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import type { ComponentChildren } from "preact";
import { APP_BASE_URL, withBasePath } from "../base-path";
import { KamodUiBrandLogo } from "./KamodUiBrandLogo";
import { PageOpening } from "./PageOpening";

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
  return <PageOpening base={APP_BASE_URL} compact={compact} />;
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
          <span class="page-state-message-brand" aria-hidden="true">
            <KamodUiBrandLogo />
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
