/** Shared native contents links, active reading position and history restoration. */
import { useEffect, useState } from "preact/hooks";
import type { BlockGuideIdentity, BlockGuideSection } from "./types";

/** Tracks the reading position and restores same-page Back/Forward navigation. */
const useActiveHeading = (blockId: string, sections: readonly BlockGuideSection[]) => {
  const overviewId = `${blockId}-overview`;
  const [activeId, setActiveId] = useState<string>(overviewId);

  useEffect(() => {
    const ids = [
      overviewId,
      blockId,
      ...sections.flatMap((entry) => [entry.id, ...(entry.children?.map(({ id }) => id) ?? [])]),
    ];
    const headings = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    const topbar = document.querySelector<HTMLElement>(".docs-topbar");
    let frame = 0;
    const update = () => {
      frame = 0;
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
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const restoreHash = () => {
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
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", restoreHash);
    };
  }, [blockId, overviewId, sections]);

  return activeId;
};

/** Native links retain keyboard navigation, deep links and browser history. */
export const BlockGuideContents = ({
  block,
  sections,
  id,
}: {
  block: BlockGuideIdentity;
  id: string;
  sections: readonly BlockGuideSection[];
}) => {
  const overviewId = `${block.id}-overview`;
  const activeId = useActiveHeading(block.id, sections);

  return (
    <aside class="blocks-doc-toc">
      <nav aria-labelledby={id}>
        <h2 id={id}>On this page</h2>
        <ul>
          <li>
            <a href="#top" aria-current={activeId === overviewId ? "location" : undefined}>
              Overview
            </a>
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
          </li>
          {sections.map((entry) => (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                aria-current={activeId === entry.id ? "location" : undefined}
              >
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
      </nav>
    </aside>
  );
};
