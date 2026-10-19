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
export function connectRightSidebarLinks(
  node: HTMLElement,
  onNavigate: () => void,
  initialTop = node.scrollTop,
) {
  const doc = node.ownerDocument;
  const win = doc.defaultView!;
  const navigation = win.performance.getEntriesByType?.("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  // Reload restoration can move the article after hydration. Reveal its active
  // destination initially, then resume reading follow only after renewed intent.
  const reloaded =
    navigation?.type === "reload" &&
    (!navigation.name ||
      documentKey(new URL(navigation.name)) === documentKey(new URL(win.location.href)));
  let trackingEnabled = !reloaded;
  let restoredTop: unknown = reloaded ? win.history.state?.ppScrollY : null;
  let initializing = true;
  let followedLink: HTMLAnchorElement | null = null;
  const stopInitialReveal = () => {
    initializing = false;
    followedLink = null;
  };
  const readingIntent = (event: Event) => {
    stopInitialReveal();
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
  // The URL's explicit destination stays selected while aria-current follows reading.
  const selectFragment = () => {
    const current = new URL(win.location.href);
    const id = fragment(current);
    for (const link of node.querySelectorAll<HTMLAnchorElement>(
      "a[href]:not([data-contents-action])",
    )) {
      const target = new URL(link.href, current);
      link.toggleAttribute(
        "data-contents-selected",
        Boolean(id && documentKey(target) === documentKey(current) && fragment(target) === id),
      );
    }
  };
  let previousActive = activeLink();
  const canScroll = () => {
    const style = getComputedStyle(node);
    return (
      node.clientHeight > 0 &&
      /^(auto|scroll)$/.test(style.overflowY) &&
      style.visibility === "visible"
    );
  };

  const reveal = (link: HTMLAnchorElement, reading = false) => {
    if (!canScroll()) return;
    const bounds = node.getBoundingClientRect();
    const item = link.getBoundingClientRect();
    const paneTop = bounds.top + node.clientTop;
    let top = Math.max(0, paneTop);
    let bottom = Math.min(win.innerHeight, paneTop + node.clientHeight);
    if (bottom <= top && !reading) {
      // A block's contents can start below its preview; prepare its own pane without moving the page.
      top = paneTop;
      bottom = paneTop + node.clientHeight;
    }
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
    const following = reading ? Math.min(40, Math.max(0, height - itemHeight - inset * 2)) : 0;
    const safeTop = top + inset;
    const safeBottom = bottom - inset - following;
    const delta =
      // Keep explicitly followed links aligned at the top; allow subpixel rounding.
      item.top < top - 1 || itemHeight > height - inset * 2
        ? item.top - safeTop
        : item.bottom > (reading ? safeBottom : bottom + 1)
          ? item.bottom - safeBottom
          : 0;
    if (delta) {
      onNavigate();
      // Scroll this pane only; scrollIntoView could also move the article or its ancestors.
      node.scrollTop = Math.max(0, node.scrollTop + delta);
    }
  };
  // Existing restoration/resize callbacks retry hidden or late-layout destinations.
  const revealDestination = (restart = false) => {
    if (restart) {
      initializing = true;
      initialTop = node.scrollTop;
      restoredTop = null;
      followedLink = null;
    }
    if (initializing && typeof restoredTop === "number" && Number.isFinite(restoredTop)) {
      const maximum = Math.max(0, doc.documentElement.scrollHeight - win.innerHeight);
      // Wait for restoration to start. A lazy page can overwrite history with a
      // temporary clamped position; once the article moves, its active tracker
      // owns the actual destination rather than this one-time history snapshot.
      if (
        !pageMoved &&
        win.scrollY === 0 &&
        Math.abs(win.scrollY - Math.min(Math.max(0, restoredTop), maximum)) > 1
      )
        return;
    }
    if (followedLink) {
      if (!canScroll()) return;
      onNavigate();
      node.scrollTop +=
        followedLink.getBoundingClientRect().top -
        node.getBoundingClientRect().top -
        node.clientTop;
      followedLink = null;
    }
    const link = initializing ? activeLink() : null;
    if (link && canScroll()) {
      // A late heading/layout must assess the saved position, not an intermediate reveal.
      node.scrollTop = initialTop;
      reveal(link);
    }
  };
  const revealActive = () => {
    readingFrame = 0;
    const link = activeLink();
    const changed = link !== previousActive;
    previousActive = link;
    if (initializing && (!trackingEnabled || !pageMoved)) {
      revealDestination();
    } else if (trackingEnabled && pageMoved && changed && link) {
      // Manual contents browsing keeps its offset until the article changes sections.
      reveal(link, true);
    }
  };
  const scheduleReading = () => {
    if (!readingFrame) readingFrame = requestAnimationFrame(revealActive);
  };
  const pageScroll = () => {
    if (win.scrollY === pageTop) return;
    pageTop = win.scrollY;
    pageMoved = true;
    if (initializing && !trackingEnabled && !frame) {
      // Let the heading tracker commit its restored section before checking visibility.
      frame = requestAnimationFrame(() => {
        frame = 0;
        scheduleReading();
      });
    }
    // The aria-current observer schedules a reveal only when the active section changes.
  };
  let waitingForVisibility = getComputedStyle(node).visibility !== "visible";
  const watchActiveLink = () =>
    activeObserver.observe(node, {
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-current"],
    });
  const activeObserver = new MutationObserver(() => {
    if (waitingForVisibility && getComputedStyle(node).visibility === "visible") {
      waitingForVisibility = false;
      activeObserver.disconnect();
      watchActiveLink();
    }
    scheduleReading();
  });
  watchActiveLink();
  // A visibility-only page reveal leaves bounds and aria-current unchanged. Retry
  // that initial destination, then stop watching page chrome for this connection.
  if (waitingForVisibility)
    activeObserver.observe(doc.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
  win.addEventListener("scroll", pageScroll, { passive: true });

  const follow = (url: URL) => {
    if (documentKey(url) !== documentKey(new URL(win.location.href))) return;
    const id = fragment(url);
    const link = Array.from(
      node.querySelectorAll<HTMLAnchorElement>("a[href]:not([data-contents-action])"),
    ).find((entry) => {
      const target = new URL(entry.href, win.location.href);
      return documentKey(target) === documentKey(url) && fragment(target) === id;
    });
    if (url.hash && (!id || !link)) return;
    stopInitialReveal();
    // Native anchor scrolling can activate intermediate headings. Keep the explicitly
    // followed destination aligned until the reader resumes interacting with the article.
    trackingEnabled = false;
    followedLink = link ?? null;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      frame = 0;
      // Native anchors and router history writes finish after the click handler.
      selectFragment();
      revealDestination();
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
  const hash = () => {
    selectFragment();
    follow(new URL(win.location.href));
  };
  doc.addEventListener("click", click);
  win.addEventListener("hashchange", hash);
  selectFragment();
  // Reload follows the restored reading position, rather than an old URL fragment.
  if (!reloaded && win.location.hash) follow(new URL(win.location.href));
  const disconnect = () => {
    cancelAnimationFrame(frame);
    cancelAnimationFrame(readingFrame);
    activeObserver.disconnect();
    win.removeEventListener("scroll", pageScroll);
    for (const event of readingEvents) doc.removeEventListener(event, readingIntent);
    doc.removeEventListener("click", click);
    win.removeEventListener("hashchange", hash);
  };
  return { revealDestination, stopInitialReveal, disconnect };
}
