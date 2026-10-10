import type { ComponentChildren } from "preact";
import { linkTitle } from "../../link-title";
import type { DocContentsSection } from "../types";

/** Reading order, including descendants, for active headings and history restoration. */
export const flattenContents = (entries: readonly DocContentsSection[]): DocContentsSection[] =>
  entries.flatMap((entry) => [entry, ...flattenContents(entry.children ?? [])]);

/** One semantic list at each depth; typography caps at four levels to keep links readable. */
export function PageContentsList({
  entries,
  children,
  activeId,
  depth = 1,
  getHref = (id) => `#${id}`,
}: {
  entries: readonly DocContentsSection[];
  children?: ComponentChildren;
  activeId: string;
  depth?: number;
  getHref?: (id: string) => string;
}) {
  return (
    <ul class="page-contents-list">
      {children}
      {entries.map((entry) => (
        <li key={entry.id}>
          <a
            href={getHref(entry.id)}
            class={`docs-toc-link${depth > 1 ? " docs-toc-link-child" : ""}${activeId === entry.id ? " is-active" : ""}`}
            data-contents-depth={Math.min(depth, 4)}
            aria-current={activeId === entry.id ? "location" : undefined}
          >
            {entry.step ? `${entry.step}. ` : ""}
            {linkTitle(entry.label)}
          </a>
          {!!entry.children?.length && (
            <PageContentsList
              entries={entry.children}
              activeId={activeId}
              depth={depth + 1}
              getHref={getHref}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
