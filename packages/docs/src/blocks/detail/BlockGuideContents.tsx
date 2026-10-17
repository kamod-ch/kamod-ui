/** Shared native contents links, active reading position and history restoration. */
import { useEffect, useState } from "preact/hooks";
import { PageContentsHeading } from "../../docs/components/PageContentsHeading";
import { flattenContents, PageContentsList } from "../../docs/components/PageContentsList";
import { scheduleSectionScroll } from "../../docs/scroll-to-section";
import { useRightSidebarScroll } from "../../layout/navigation/right-sidebar-memory";
import { linkTitle } from "../../link-title";
import type { BlockGuideIdentity, BlockGuideSection } from "./types";

type OverviewChild = ContentsSection;
const noOverviewChildren: readonly OverviewChild[] = [];
const mountedNavigations = new WeakSet<PerformanceNavigationTiming>();

type ContentsSection = Pick<BlockGuideSection, "id" | "label" | "children">;

/** Tracks the reading position and restores same-page Back/Forward navigation. */
const useActiveHeading = (
  blockId: string | undefined,
  sections: readonly ContentsSection[],
  overviewId: string,
  overviewChildren: readonly OverviewChild[],
) => {
  const [activeId, setActiveId] = useState<string>(overviewId);

  useEffect(() => {
    const ids = [
      overviewId,
      ...(blockId ? [blockId] : []),
      ...flattenContents(overviewChildren).map(({ id }) => id),
      ...flattenContents(sections).map(({ id }) => id),
    ];
    const resolveHeadings = () =>
      ids
        .map((id) => document.getElementById(id))
        .filter((element): element is HTMLElement => element !== null);
    let headings = resolveHeadings();
    const topbar = document.querySelector<HTMLElement>(".docs-topbar");
    const desktop = window.matchMedia("(min-width: 1200px)");
    const visible = () => desktop.matches;
    let frame = 0;
    let offsets: number[] | undefined;
    let readingLine = 112;
    let readingReady = false;
    const refreshHeadings = () => {
      if (!headings.some((heading) => !heading.isConnected)) return;
      headings = resolveHeadings();
      offsets = undefined;
      readingReady = false;
    };
    const update = () => {
      frame = 0;
      refreshHeadings();
      if (!visible()) return;
      if (!readingReady && headings[0] && getComputedStyle(headings[0]).visibility !== "visible")
        return;
      readingReady = true;
      if (!offsets) {
        readingLine = (topbar?.getBoundingClientRect().height ?? 64) + 48;
        const padding =
          Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
        // Anchor styles only change with layout breakpoints, not on every scroll frame.
        offsets = headings.map(
          (heading) =>
            padding + (Number.parseFloat(getComputedStyle(heading).scrollMarginTop) || 0),
        );
      }
      let current = overviewId;
      // Contents follow document order. Binary search avoids measuring every preceding
      // heading on every frame, while still handling lazy content changing their positions.
      let low = 0;
      let high = headings.length;
      while (low < high) {
        const middle = (low + high) >>> 1;
        if (
          headings[middle].getBoundingClientRect().top <=
          Math.max(readingLine, offsets[middle]) + 1
        )
          low = middle + 1;
        else high = middle;
      }
      if (low) current = headings[low - 1].id;
      // A short final section may never reach the reading line before the page ends.
      if (Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight) {
        current = headings.at(-1)?.id ?? current;
      }
      setActiveId(current);
    };
    const schedule = () => {
      if (visible() && !frame) frame = window.requestAnimationFrame(update);
    };
    const resize = () => {
      offsets = undefined;
      schedule();
    };
    const restoreHash = () => {
      refreshHeadings();
      // The single contents instance restores history at every viewport width.
      // PreactPress sets scrollRestoration to manual, including same-page Back/Forward.
      if (window.location.hash === "#top") {
        window.scrollTo({ top: 0, behavior: "instant" });
      } else {
        const target = headings.find((heading) => heading.id === window.location.hash.slice(1));
        target?.scrollIntoView({ block: "start", behavior: "instant" });
      }
      schedule();
    };
    // Hydration can briefly hide a lazy guide and undo the browser's first anchor jump.
    // Follow it once after this guide's real headings mount, yielding to reading intent.
    const initialHref = window.location.href;
    const navigation = performance.getEntriesByType?.("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    // The browser's navigation entry outlives SPA route changes. A later return to
    // this original URL is a fresh anchor request, not another document reload.
    const firstContentsMount = !navigation || !mountedNavigations.has(navigation);
    if (navigation) mountedNavigations.add(navigation);
    const documentPath = (href: string) => {
      const url = new URL(href, initialHref);
      return `${url.origin}${url.pathname.replace(/\/+$/, "")}${url.search}`;
    };
    const restoringHistory =
      firstContentsMount &&
      (navigation?.type === "reload" || navigation?.type === "back_forward") &&
      (!navigation.name || documentPath(navigation.name) === documentPath(initialHref));
    const initialTop = window.location.hash === "#top";
    const initialTarget = initialTop
      ? (headings.find((heading) => heading.id === overviewId) ?? headings[0])
      : document.getElementById(window.location.hash.slice(1));
    let cancelInitialFollow: (() => void) | undefined;
    if (!restoringHistory && window.location.hash && initialTarget) {
      cancelInitialFollow = scheduleSectionScroll(initialTarget.id, "instant", (target) => {
        if (initialTop) window.scrollTo({ top: 0, behavior: "instant" });
        else target.scrollIntoView({ block: "start", behavior: "instant" });
        offsets = undefined;
        update();
      });
    }
    // Visibility-only page reveal does not emit a resize or article scroll. Initialize
    // reading after that reveal without changing the article's saved/fresh position.
    const cancelReadyUpdate =
      !cancelInitialFollow && headings[0]
        ? scheduleSectionScroll(headings[0].id, "instant", () => {
            offsets = undefined;
            update();
          })
        : undefined;
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", resize);
    window.addEventListener("hashchange", restoreHash);
    desktop.addEventListener("change", resize);
    return () => {
      cancelInitialFollow?.();
      cancelReadyUpdate?.();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", resize);
      window.removeEventListener("hashchange", restoreHash);
      desktop.removeEventListener("change", resize);
    };
  }, [blockId, overviewId, overviewChildren, sections]);

  return activeId;
};

/** Native links retain keyboard navigation, deep links and browser history for all block guides. */
export const BlockGuideContents = ({
  block,
  sections,
  id,
  pageTitle,
  overviewChildren = noOverviewChildren,
}: {
  block?: BlockGuideIdentity;
  /** Use a guide’s visible main heading as its first contents entry. */
  pageTitle?: string;
  /** Optional destinations within the opening overview, such as a component preview. */
  overviewChildren?: readonly OverviewChild[];
  id: string;
  sections: readonly ContentsSection[];
}) => {
  const contentsRef = useRightSidebarScroll<HTMLElement>("block-contents");
  const overviewId = pageTitle ? "page-title" : block ? `${block.id}-overview` : "top";
  const activeId = useActiveHeading(block?.id, sections, overviewId, overviewChildren);
  const overview = (
    <li>
      <a
        href={pageTitle ? "#page-title" : "#top"}
        data-contents-depth="1"
        aria-current={activeId === overviewId ? "location" : undefined}
      >
        {linkTitle(pageTitle ?? "Overview")}
      </a>
      {!!overviewChildren.length && (
        <PageContentsList entries={overviewChildren} activeId={activeId} depth={2} />
      )}
    </li>
  );
  return (
    <aside class="blocks-doc-toc">
      <nav aria-labelledby={id} ref={contentsRef}>
        <PageContentsHeading
          id={id}
          count={sections.length + (block ? 2 : 1)}
          activeId={activeId}
        />
        <PageContentsList entries={sections} activeId={activeId}>
          {overview}
          {block && (
            <li>
              <a
                href={`#${block.id}`}
                data-contents-depth="1"
                aria-current={activeId === block.id ? "location" : undefined}
              >
                Live Preview
              </a>
            </li>
          )}
        </PageContentsList>
      </nav>
    </aside>
  );
};
