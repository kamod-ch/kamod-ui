import { CompassIcon, ListTreeIcon } from "@kamod-ch/icons/lucide";
import { SidebarEntryContent } from "../../layout/navigation/SidebarEntryContent";

/** Match the pinned navigation rows; the existing reading state supplies a native section shortcut. */
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
  const sectionLabel = count === 1 ? "Section" : "Sections";
  return (
    <div class="page-contents-header navigation-header">
      <div class="sidebar-entry-row">
        <SidebarEntryContent
          id={id}
          heading={level}
          icon={<ListTreeIcon size={16} strokeWidth={1.8} aria-hidden="true" />}
          title={
            <a class="page-contents-top-link" href="" title="Return to the start of this page">
              On This Page
            </a>
          }
          caption={
            <span
              class="page-contents-count"
              aria-label={`${count} main page ${sectionLabel.toLowerCase()}`}
            >
              {count} {sectionLabel}
            </span>
          }
          action={
            <a
              class="sidebar-entry-action page-contents-locate"
              href={activeId && activeId !== "top" ? `#${activeId}` : ""}
              aria-label="Jump to the current section"
              data-tooltip="Jump to the current section"
              data-contents-action=""
            >
              <CompassIcon size={16} strokeWidth={2} aria-hidden="true" />
            </a>
          }
        />
      </div>
    </div>
  );
}
