import { LoaderCircleIcon } from "@kamod-ch/icons/lucide";

/** A quiet reading placeholder while the shared reference module loads on demand. */
export function CodeReferenceHelpLoading({
  name,
  module,
  active = true,
  technology = false,
}: {
  name: string;
  module: string;
  /** The outgoing crossfade remains decorative after the real reference is ready. */
  active?: boolean;
  technology?: boolean;
}) {
  return (
    <div
      class={`code-reference-help-layout code-reference-help-loading${technology ? " code-reference-help-loading-technology" : ""}`}
      aria-busy={active || undefined}
    >
      <header class="code-reference-help-header">
        <span class="code-reference-help-kind-icon" aria-hidden="true">
          <LoaderCircleIcon
            class="code-reference-help-loading-spinner"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
        </span>
        <div class="code-reference-help-heading">
          <div class="code-reference-help-title">
            <strong>
              <code title={module}>{name}</code>
            </strong>
          </div>
          <p class="code-reference-help-loading-context">Following the reference...</p>
        </div>
      </header>
      <div class="code-reference-help-loading-lines docs-loading-skeleton" aria-hidden="true">
        <i class="docs-loading-shape" />
        <i class="docs-loading-shape" />
        <i class="docs-loading-shape" />
        <span>
          <i class="docs-loading-shape" />
          <i class="docs-loading-shape" />
        </span>
      </div>
      <p class="code-reference-help-loading-note" role={active ? "status" : undefined}>
        Just grabbing the details for you.
      </p>
    </div>
  );
}

/** Preserve a usable destination when optional reference details cannot be loaded. */
export function CodeReferenceHelpUnavailable({
  name,
  module,
  href,
}: {
  name: string;
  module: string;
  href: string;
}) {
  return (
    <div class="code-reference-help-unavailable">
      <strong>
        <code>{name}</code>
      </strong>
      <p>Extra details could not be opened. The reference link is still available.</p>
      <p class="code-reference-help-loading-module" dir="ltr">
        {module}
      </p>
      <a class="code-reference-help-fallback-link" href={href} target="_top">
        Open the reference
      </a>
    </div>
  );
}
