import { CopyButton } from "@kamod-ch/ui/copy-button";

/** Reuse the contents' existing reading state; never observe or measure the document again. */
function sectionLink(activeId?: string) {
  if (typeof window === "undefined") return "";
  const url = new URL(window.location.href);
  if (activeId !== undefined)
    url.hash = activeId === "top" || activeId === "page-title" ? "" : activeId;
  return url.href;
}

/** Shared contents heading, page-top link and compact action for sharing the reading position. */
export function PageContentsHeading({
  id,
  count,
  activeId,
  level = "h2",
}: {
  id?: string;
  count: number;
  /** The current section from the caller's existing contents tracking. */
  activeId?: string;
  level?: "h2" | "h3";
}) {
  const Heading = level;
  const sectionLabel = count === 1 ? "Section" : "Sections";
  return (
    <div class="page-contents-header" data-heading-level={level}>
      <div class="page-contents-label">
        <Heading id={id} class="page-contents-heading">
          <a href="" title="Return to the start of this page">
            On This Page
          </a>
        </Heading>
        <span class="page-contents-separator" aria-hidden="true">
          ·
        </span>
        <span
          class="page-contents-count"
          aria-label={`${count} main page ${sectionLabel.toLowerCase()}`}
        >
          {count} <span class="page-contents-count-page">Page </span>
          {sectionLabel}
        </span>
      </div>
      <CopyButton
        value={sectionLink(activeId)}
        label="Copy page or section link"
        subject="section link"
        iconOnly
        class="page-contents-copy"
      />
    </div>
  );
}
