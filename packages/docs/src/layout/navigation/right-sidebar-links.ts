/** Normalize only trailing slashes; query strings still identify different documents. */
const documentKey = (url: URL) => `${url.origin}${url.pathname.replace(/\/+$/, "")}${url.search}`;

function fragment(url: URL) {
  try {
    return decodeURIComponent(url.hash.slice(1));
  } catch {
    return "";
  }
}

/**
 * Align followed links and keep the active reading destination visible. Only the actual
 * scroll container participates; nested, overflow-visible contents lists are ignored.
 * Moving this container directly leaves the document's native anchor handling intact.
 */
export function connectRightSidebarLinks(node: HTMLElement, onNavigate: () => void) {
  const doc = node.ownerDocument;
  const win = doc.defaultView!;
  const navigation = win.performance.getEntriesByType?.("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  // Reload restoration can move the article after hydration. Preserve sidebar memory
  // until the reader actually interacts with the page again.
  let trackingEnabled = navigation?.type !== "reload";
  const readingIntent = (event: Event) => {
    if (event.target instanceof Node && node.contains(event.target)) return;
    trackingEnabled = true;
  };
  const readingEvents = ["wheel", "touchmove", "pointerdown", "keydown"] as const;
  for (const event of readingEvents) doc.addEventListener(event, readingIntent, { passive: true });
  let frame = 0;
  let readingFrame = 0;
  let pageTop = win.scrollY;
  let pageMoved = false;
  const activeLink = () => node.querySelector<HTMLAnchorElement>('a[aria-current="location"]');
  let previousActive = activeLink();
  const canScroll = () =>
    node.clientHeight > 0 && /^(auto|scroll)$/.test(getComputedStyle(node).overflowY);

  const revealActive = () => {
    readingFrame = 0;
    const link = activeLink();
    const changed = link !== previousActive;
    previousActive = link;
    // Hydration and manually browsing the contents must not discard the saved offset.
    if (!trackingEnabled || !pageMoved || !changed || !link || !canScroll()) return;
    const bounds = node.getBoundingClientRect();
    const item = link.getBoundingClientRect();
    let top = Math.max(0, bounds.top + node.clientTop);
    let bottom = Math.min(win.innerHeight, bounds.top + node.clientTop + node.clientHeight);
    // A surrounding sidebar can clip this pane before its own scrollport ends.
    for (let parent = node.parentElement; parent; parent = parent.parentElement) {
      if (!/^(auto|scroll|hidden|clip)$/.test(getComputedStyle(parent).overflowY)) continue;
      const parentTop = parent.getBoundingClientRect().top + parent.clientTop;
      top = Math.max(top, parentTop);
      bottom = Math.min(bottom, parentTop + parent.clientHeight);
    }
    const height = bottom - top;
    if (height <= 0) return;
    const inset = Math.min(16, height / 8);
    const itemHeight = item.bottom - item.top;
    // Leave a glimpse of the next entry, but never sacrifice the active link to make room.
    const following = Math.min(40, Math.max(0, height - itemHeight - inset * 2));
    const safeTop = top + inset;
    const safeBottom = bottom - inset - following;
    const delta =
      // Keep explicitly followed links aligned at the top; allow subpixel rounding.
      item.top < top - 1 || itemHeight > height - inset * 2
        ? item.top - safeTop
        : item.bottom > safeBottom
          ? item.bottom - safeBottom
          : 0;
    if (delta) {
      onNavigate();
      // Scroll this pane only; scrollIntoView could also move the article or its ancestors.
      node.scrollTop += delta;
    }
  };
  const scheduleReading = () => {
    if (!readingFrame) readingFrame = requestAnimationFrame(revealActive);
  };
  const pageScroll = () => {
    if (win.scrollY === pageTop) return;
    pageTop = win.scrollY;
    pageMoved = true;
    // The aria-current observer schedules a reveal only when the active section changes.
  };
  const activeObserver = new MutationObserver(scheduleReading);
  activeObserver.observe(node, {
    subtree: true,
    attributes: true,
    attributeFilter: ["aria-current"],
  });
  win.addEventListener("scroll", pageScroll, { passive: true });

  const follow = (url: URL) => {
    if (!url.hash || documentKey(url) !== documentKey(new URL(win.location.href))) return;
    const id = fragment(url);
    const link = Array.from(node.querySelectorAll<HTMLAnchorElement>("a[href]")).find((entry) => {
      const target = new URL(entry.href, win.location.href);
      return documentKey(target) === documentKey(url) && fragment(target) === id;
    });
    if (!id || !link) return;
    // Native anchor scrolling can activate intermediate headings. Keep the explicitly
    // followed destination aligned until the reader resumes interacting with the article.
    trackingEnabled = false;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (!canScroll()) return;
      onNavigate();
      node.scrollTop +=
        link.getBoundingClientRect().top - node.getBoundingClientRect().top - node.clientTop;
    });
  };
  const click = (event: MouseEvent) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    const link =
      event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
    if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
    follow(new URL(link.href, win.location.href));
  };
  const hash = () => follow(new URL(win.location.href));
  doc.addEventListener("click", click);
  win.addEventListener("hashchange", hash);
  // A reload restores the reader's manually chosen sidebar offset, even with an old fragment.
  if (navigation?.type !== "reload") hash();
  return () => {
    cancelAnimationFrame(frame);
    cancelAnimationFrame(readingFrame);
    activeObserver.disconnect();
    win.removeEventListener("scroll", pageScroll);
    for (const event of readingEvents) doc.removeEventListener(event, readingIntent);
    doc.removeEventListener("click", click);
    win.removeEventListener("hashchange", hash);
  };
}
