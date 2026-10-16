/** A quiet reading placeholder while the shared reference module loads on demand. */
export function CodeReferenceHelpLoading({ name, module }: { name: string; module: string }) {
  return (
    <div class="code-reference-help-loading" aria-busy="true">
      <div class="code-reference-help-loading-top">
        <span class="code-reference-help-loading-mark" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <div class="code-reference-help-loading-heading">
          <div class="code-reference-help-loading-title">
            <strong>Following the reference...</strong>
            <span class="code-reference-help-loading-spinner" aria-hidden="true" />
          </div>
          <code title={module}>{name}</code>
        </div>
      </div>
      <div class="code-reference-help-loading-lines" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>
          <i />
          <i />
        </span>
      </div>
      <p class="code-reference-help-loading-note" role="status">
        Bringing the reference and its useful links into view.
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
