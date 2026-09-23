/** Native in-page navigation and scroll tracking for the application-shell guide. */
import { useEffect, useState } from "preact/hooks";
import type { ApplicationShellBlock } from "./application-shell-config";

/** An in-page destination, optionally grouped with one level of subsection links. */
type ShellContentsEntry = {
  id: string;
  label: string;
  children?: readonly { id: string; label: string }[];
};

/** Reading order for the documentation; IDs also support direct links and browser history. */
const shellContents: readonly ShellContentsEntry[] = [
  {
    id: "application-shell-installation",
    label: "Add this block",
    children: [
      { id: "application-shell-copy", label: "1. Copy the block" },
      { id: "application-shell-dependencies", label: "2. Install missing dependencies" },
      { id: "application-shell-styles", label: "3. Set up styles and import" },
    ],
  },
  { id: "application-shell-usage", label: "Usage" },
  {
    id: "application-shell-props",
    label: "Props and data",
    children: [
      { id: "application-shell-prop-reference", label: "Component props" },
      { id: "application-shell-navigation-data", label: "Type your navigation data" },
      { id: "application-shell-data-types", label: "Data type reference" },
      { id: "application-shell-callbacks", label: "Navigation and callbacks" },
      { id: "application-shell-state", label: "Sidebar state" },
    ],
  },
  {
    id: "application-shell-about",
    label: "About this block",
    children: [
      { id: "application-shell-structure", label: "Structure and composition" },
      { id: "application-shell-navigation", label: "Navigation and routing" },
      { id: "application-shell-responsive", label: "Responsive behavior and state" },
      { id: "application-shell-account", label: "Account menu and page content" },
      { id: "application-shell-accessibility", label: "Accessibility and styling" },
      { id: "application-shell-demo", label: "Making it your own" },
    ],
  },
  { id: "application-shell-reference", label: "Design reference" },
];

/** Tracks the reading position and restores same-page Back/Forward navigation. */
const useActiveHeading = (blockId: string) => {
  const overviewId = `${blockId}-overview`;
  const [activeId, setActiveId] = useState<string>(overviewId);

  useEffect(() => {
    const ids = [
      overviewId,
      blockId,
      ...shellContents.flatMap((entry) => [
        entry.id,
        ...(entry.children?.map(({ id }) => id) ?? []),
      ]),
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
  }, [blockId, overviewId]);

  return activeId;
};

/** Native links retain keyboard navigation, deep links and browser history. */
export const ShellTableOfContents = ({ block }: { block: ApplicationShellBlock }) => {
  const overviewId = `${block.id}-overview`;
  const activeId = useActiveHeading(block.id);

  return (
    <aside class="blocks-doc-toc">
      <nav aria-labelledby="application-shell-contents">
        <h2 id="application-shell-contents">On this page</h2>
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
          {shellContents.map((entry) => (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                aria-current={activeId === entry.id ? "location" : undefined}
              >
                {entry.label}
              </a>
              {entry.children && (
                <ul>
                  {entry.children.map((child) => (
                    <li key={child.id}>
                      <a
                        href={`#${child.id}`}
                        aria-current={activeId === child.id ? "location" : undefined}
                      >
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
