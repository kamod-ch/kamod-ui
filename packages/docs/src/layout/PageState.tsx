import {
  ArrowRightIcon,
  BookOpenIcon,
  CompassIcon,
  ComponentIcon,
  HouseIcon,
  LayersIcon,
  PackageIcon,
  RouteIcon,
} from "@kamod-ch/icons/lucide";
import { Button } from "@kamod-ch/ui/button";
import type { ComponentChildren } from "preact";
import { withBasePath } from "../base-path";
import { KamodMarkIcon } from "../docs/components/brand/KamodMarkIcon";

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
          <KamodMarkIcon size={24} />
          <span>Kamod UI</span>
          <span class="page-state-secondary">Documentation</span>
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
          Explore the Source <ArrowRightIcon size={14} aria-hidden="true" />
        </a>
      </footer>
    </div>
  );
}

const destinations = [
  {
    label: "Components",
    description: "Small pieces. Plenty of possibilities.",
    href: "/docs/components",
    Icon: ComponentIcon,
  },
  {
    label: "Blocks",
    description: "A head start on your next screen.",
    href: "/blocks",
    Icon: LayersIcon,
  },
  {
    label: "Forms",
    description: "Inputs, validation, and a little clarity.",
    href: "/docs/forms",
    Icon: BookOpenIcon,
  },
  {
    label: "Packages",
    description: "Meet the rest of the toolkit.",
    href: "/docs/packages",
    Icon: PackageIcon,
  },
];

/** A standalone recovery page, with no demo registry or browser-only state. */
export function PageNotFound() {
  return (
    <PageStateFrame notFound>
      <section class="not-found-hero" aria-labelledby="page-state-title">
        <div class="not-found-art" aria-hidden="true">
          <div class="not-found-grid" />
          <span class="not-found-digit">4</span>
          <div class="not-found-zero">
            <span class="not-found-coordinate">N</span>
            <CompassIcon class="not-found-compass" strokeWidth={1.2} />
            <span class="not-found-orbit">
              <i />
            </span>
          </div>
          <span class="not-found-digit">4</span>
          <span class="not-found-detour">
            <RouteIcon size={14} /> A slight detour
          </span>
        </div>
        <p class="not-found-status">
          <span /> Error 404 <i aria-hidden="true">/</i> Page not found
        </p>
        <h1 id="page-state-title">This page is off the map.</h1>
        <p class="not-found-description">
          A moved link, a mistyped address, or a little detour.
          <br />
          There’s no page here. Let’s find you a better starting point.
        </p>
        <div class="not-found-actions">
          <Button href={withBasePath("/")} variant="inverse" size="lg">
            <HouseIcon data-icon="inline-start" aria-hidden="true" /> Back to Home
          </Button>
          <Button href={withBasePath("/docs/getting-started")} variant="outline" size="lg">
            Getting Started <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
          </Button>
        </div>
      </section>
      <section class="not-found-destinations" aria-labelledby="page-state-explore">
        <div class="not-found-divider">
          <h2 id="page-state-explore">Good places to get lost in</h2>
          <span aria-hidden="true">↓</span>
        </div>
        <nav class="not-found-links" aria-label="Explore the documentation">
          {destinations.map(({ label, description, href, Icon }) => (
            <a key={href} href={withBasePath(href)}>
              <Icon class="not-found-link-icon" size={19} strokeWidth={1.7} aria-hidden="true" />
              <span>
                <strong>{label}</strong>
                <span>{description}</span>
              </span>
              <ArrowRightIcon class="not-found-link-arrow" size={15} aria-hidden="true" />
            </a>
          ))}
        </nav>
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
        <p class="page-state-eyebrow">
          <span class="page-state-pulse" aria-hidden="true" /> Kamod UI{" "}
          <span aria-hidden="true">·</span> {compact ? "Preview" : "Documentation"}
        </p>
        <h1>{compact ? "Loading Preview…" : "Opening Your Next Page…"}</h1>
        <p class="page-state-description">
          {compact
            ? "Preparing the interactive example."
            : "Loading the guide and its examples. The page will appear here when it’s ready."}
        </p>
      </div>
      <div class="page-state-skeleton" aria-hidden="true">
        <span />
        <span />
        <span />
        <div />
      </div>
    </section>
  );
  return compact ? content : <PageStateFrame>{content}</PageStateFrame>;
}

export function PageLoadError({ compact = false }: { compact?: boolean }) {
  const content = (
    <section class="page-state-hero" role="alert">
      <p class="page-state-eyebrow">
        <RouteIcon size={17} aria-hidden="true" /> Loading Interrupted
      </p>
      <h1>Let’s Try That Again.</h1>
      <p class="page-state-description">
        We couldn’t load this content. Check your connection, then reload to try again.
      </p>
      <div class="page-state-actions">
        <button class="page-state-primary" type="button" onClick={() => window.location.reload()}>
          Reload Page <ArrowRightIcon size={18} aria-hidden="true" />
        </button>
        {!compact && (
          <a class="page-state-text-link" href={withBasePath("/")}>
            Back to Home
          </a>
        )}
      </div>
    </section>
  );
  return compact ? content : <PageStateFrame>{content}</PageStateFrame>;
}
