import type { ComponentChildren } from "preact";

/** Shared pinned-row content keeps both sidebars' typography and row spacing consistent. */
export function SidebarEntryContent({
  icon,
  title,
  caption,
  action,
  heading: Title = "strong",
  id,
}: {
  icon: ComponentChildren;
  title: ComponentChildren;
  caption: ComponentChildren;
  action: ComponentChildren;
  heading?: "strong" | "h2" | "h3";
  id?: string;
}) {
  return (
    <>
      {icon}
      <div class="navigation-header-heading sidebar-entry-heading">
        <Title id={id} class="sidebar-entry-title">
          {title}
        </Title>
        <span class="sidebar-entry-caption">
          <span aria-hidden="true">·</span> {caption}
        </span>
      </div>
      {action}
    </>
  );
}
