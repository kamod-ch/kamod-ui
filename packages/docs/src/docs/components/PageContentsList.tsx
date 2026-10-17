import { ChevronDownIcon } from "@kamod-ch/icons/lucide";
import type { ComponentChildren } from "preact";
import { useEffect, useId, useLayoutEffect, useMemo, useState } from "preact/hooks";
import { linkTitle, linkTitleChildren } from "../../link-title";
import type { DocContentsSection } from "../types";

/** Reading order, including descendants, for active headings and history restoration. */
export const flattenContents = (entries: readonly DocContentsSection[]): DocContentsSection[] =>
  entries.flatMap((entry) => [entry, ...flattenContents(entry.children ?? [])]);

type ContentsLinkProps = {
  entry: DocContentsSection;
  activeId: string;
  depth: number;
  getHref: (id: string) => string;
};

function ContentsLink({ entry, activeId, depth, getHref }: ContentsLinkProps) {
  return (
    <a
      href={getHref(entry.id)}
      class={`docs-toc-link${depth > 1 ? " docs-toc-link-child" : ""}${activeId === entry.id ? " is-active" : ""}`}
      data-contents-depth={Math.min(depth, 4)}
      aria-current={activeId === entry.id ? "location" : undefined}
    >
      {entry.step ? `${entry.step}. ` : ""}
      {linkTitleChildren(entry.label)}
    </a>
  );
}

/** Keep navigation and expansion independent; collapsed destinations retain their identity. */
function CollapsibleContentsItem(props: ContentsLinkProps) {
  const { entry, activeId, depth, getHref } = props;
  const panelId = useId();
  const descendantKey = JSON.stringify(flattenContents(entry.children ?? []).map(({ id }) => id));
  const descendants = useMemo(() => new Set<string>(JSON.parse(descendantKey)), [descendantKey]);
  const [open, setOpen] = useState(() => descendants.has(activeId));

  // A new reading destination reveals its group. Manual closure survives ordinary rerenders.
  useLayoutEffect(() => {
    if (descendants.has(activeId)) setOpen(true);
  }, [activeId, descendants]);

  useEffect(() => {
    const currentDocument = (url: URL) =>
      `${url.origin}${url.pathname.replace(/\/+$/, "")}${url.search}`;
    const reveal = (url: URL) => {
      if (currentDocument(url) !== currentDocument(new URL(location.href))) return;
      try {
        if (descendants.has(decodeURIComponent(url.hash.slice(1)))) setOpen(true);
      } catch {
        // An invalid fragment is not a contents destination.
      }
    };
    const hash = () => reveal(new URL(location.href));
    const click = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      const link =
        event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self"))
        return;
      try {
        reveal(new URL(link.href, location.href));
      } catch {
        // Unrelated malformed links must not interrupt normal page navigation.
      }
    };
    hash();
    document.addEventListener("click", click);
    window.addEventListener("hashchange", hash);
    return () => {
      document.removeEventListener("click", click);
      window.removeEventListener("hashchange", hash);
    };
  }, [descendants]);

  return (
    <li>
      <div class="page-contents-disclosure-row">
        <ContentsLink {...props} />
        <button
          type="button"
          class="page-contents-disclosure-toggle"
          aria-label={`Toggle ${linkTitle(entry.label)} sections`}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          <ChevronDownIcon size={13} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
      <div id={panelId} class="page-contents-disclosure-panel" hidden={!open}>
        <PageContentsList
          entries={entry.children ?? []}
          activeId={activeId}
          depth={depth + 1}
          getHref={getHref}
        />
      </div>
    </li>
  );
}

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
      {entries.map((entry) =>
        entry.collapsible && entry.children?.length ? (
          <CollapsibleContentsItem
            key={entry.id}
            entry={entry}
            activeId={activeId}
            depth={depth}
            getHref={getHref}
          />
        ) : (
          <li key={entry.id}>
            <ContentsLink entry={entry} activeId={activeId} depth={depth} getHref={getHref} />
            {!!entry.children?.length && (
              <PageContentsList
                entries={entry.children}
                activeId={activeId}
                depth={depth + 1}
                getHref={getHref}
              />
            )}
          </li>
        ),
      )}
    </ul>
  );
}
