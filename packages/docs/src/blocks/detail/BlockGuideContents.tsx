/** Shared native contents links, active reading position and history restoration. */
import { useEffect, useState } from "preact/hooks";
import type { BlockGuideIdentity, BlockGuideSection } from "./types";

type ContentsSection = Pick<BlockGuideSection, "id" | "label" | "children">;

/** Tracks the reading position and restores same-page Back/Forward navigation. */
const useActiveHeading = (
  blockId: string | undefined,
  sections: readonly ContentsSection[],
  mobile: boolean,
  overviewId: string,
) => {
  const [activeId, setActiveId] = useState<string>(overviewId);

  useEffect(() => {
    const ids = [
      overviewId,
      ...(blockId ? [blockId] : []),
      ...sections.flatMap((entry) => [entry.id, ...(entry.children?.map(({ id }) => id) ?? [])]),
    ];
    const headings = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    const topbar = document.querySelector<HTMLElement>(".docs-topbar");
    const desktop = window.matchMedia("(min-width: 1260px)");
    const visible = () => desktop.matches !== mobile;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!visible()) return;
      const readingLine = (topbar?.getBoundingClientRect().height ?? 64) + 48;
      let current = overviewId;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > readingLine) break;
        current = heading.id;
      }
      // A short final section may never reach the reading line before the page ends.
      if (Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight) {
        current = headings.at(-1)?.id ?? current;
      }
      setActiveId(current);
    };
    const schedule = () => {
      if (visible() && !frame) frame = window.requestAnimationFrame(update);
    };
    const restoreHash = () => {
      // Guides have two instances; block details have one that also restores mobile history.
      if (!blockId && !visible()) return;
      // PreactPress sets scrollRestoration to manual, including same-page Back/Forward.
      if (window.location.hash === "#top") {
        window.scrollTo({ top: 0, behavior: "instant" });
      } else {
        const target = headings.find((heading) => heading.id === window.location.hash.slice(1));
        target?.scrollIntoView({ block: "start", behavior: "instant" });
      }
      schedule();
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", restoreHash);
    desktop.addEventListener("change", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", restoreHash);
      desktop.removeEventListener("change", schedule);
    };
  }, [blockId, overviewId, sections, mobile]);

  return activeId;
};

/** Native links retain keyboard navigation, deep links and browser history for all block guides. */
export const BlockGuideContents = ({
  block,
  sections,
  id,
  mobile = false,
  pageTitle,
}: {
  block?: BlockGuideIdentity;
  /** Use a guide’s visible main heading as its first contents entry. */
  pageTitle?: string;
  id: string;
  sections: readonly ContentsSection[];
  /** Render the same section tree as an inline disclosure instead of a desktop sidebar. */
  mobile?: boolean;
}) => {
  const overviewId = block ? `${block.id}-overview` : pageTitle ? "page-title" : "top";
  const activeId = useActiveHeading(block?.id, sections, mobile, overviewId);
  const links = () => (
    <ul>
      <li>
        <a
          href={pageTitle && !block ? "#page-title" : "#top"}
          aria-current={activeId === overviewId ? "location" : undefined}
        >
          {pageTitle ?? "Overview"}
        </a>
        {block && (
          <ul>
            <li>
              <a
                href={`#${block.id}`}
                aria-current={activeId === block.id ? "location" : undefined}
              >
                {block.title} <span class="blocks-doc-toc-hint">Showcase</span>
              </a>
            </li>
          </ul>
        )}
      </li>
      {sections.map((entry) => (
        <li key={entry.id}>
          <a href={`#${entry.id}`} aria-current={activeId === entry.id ? "location" : undefined}>
            {entry.label}
          </a>
          {!!entry.children?.length && (
            <ul>
              {entry.children.map((child) => (
                <li key={child.id}>
                  <a
                    href={`#${child.id}`}
                    aria-current={activeId === child.id ? "location" : undefined}
                  >
                    {child.step ? `${child.step}. ` : ""}
                    {child.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
  return mobile ? (
    <details class="block-guide-mobile-contents">
      <summary>
        In this guide <span>{sections.length} sections</span>
      </summary>
      <nav aria-label="Guide contents">{links()}</nav>
    </details>
  ) : (
    <aside class="blocks-doc-toc">
      <nav aria-labelledby={id}>
        <h2 id={id}>On this page</h2>
        {links()}
      </nav>
    </aside>
  );
};
