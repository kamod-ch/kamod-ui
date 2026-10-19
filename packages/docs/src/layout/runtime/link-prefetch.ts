type RouteFromHref = (href: string) => string | undefined;
type Prefetch = (route: string) => unknown | Promise<unknown>;
const excluded = 'pre, code, [data-application-tooltip], [data-prefetch="false"]';

/** Schedule speculative work only when idle, with a cancellable fallback for older browsers. */
function idle(task: () => void) {
  if (typeof requestIdleCallback === "function") {
    const id = requestIdleCallback(task);
    return () => cancelIdleCallback(id);
  }
  const id = setTimeout(task, 50);
  return () => clearTimeout(id);
}

/** Small per-page speculation budget; navigation always loads directly, outside this queue. */
export function setupViewportPrefetch(routeFromHref: RouteFromHref, prefetch: Prefetch) {
  if (typeof IntersectionObserver === "undefined") return () => {};
  const routes = new Set<string>();
  const observed = new Set<HTMLAnchorElement>();
  const queued: string[] = [];
  const currentRoute = routeFromHref(location.href);
  let active = 0;
  let stopped = false;
  let cancelIdle: (() => void) | undefined;
  const schedule = () => {
    if (stopped || cancelIdle || active >= 2 || !queued.length) return;
    cancelIdle = idle(() => {
      cancelIdle = undefined;
      if (stopped) return;
      const route = queued.shift();
      if (!route) return;
      active++;
      // Promise wrapping also contains a synchronous prefetch failure.
      void Promise.resolve()
        .then(() => (stopped ? undefined : prefetch(route)))
        .catch(() => undefined)
        .finally(() => {
          active--;
          schedule();
        });
      schedule();
    });
  };
  const observer = new IntersectionObserver(
    (entries) => {
      if (stopped) return;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const link = entry.target as HTMLAnchorElement;
        observer.unobserve(link);
        observed.delete(link);
        const route = routeFromHref(link.href);
        if (!route || route === currentRoute || routes.has(route) || routes.size >= 12) continue;
        routes.add(route);
        queued.push(route);
      }
      if (routes.size >= 12) {
        // No further speculation this page: stop tracking its remaining anchors too.
        observer.disconnect();
        mutation.disconnect();
        observed.clear();
      }
      schedule();
    },
    { rootMargin: "200px" },
  );
  const observe = (root: Element) => {
    if (root.closest(excluded)) return;
    const links = root.matches("a[href]")
      ? [root as HTMLAnchorElement]
      : root.querySelectorAll<HTMLAnchorElement>("a[href]");
    for (const link of links) {
      if (link.closest(excluded) || observed.has(link)) continue;
      const route = routeFromHref(link.href);
      if (!route || route === currentRoute || routes.has(route)) continue;
      observed.add(link);
      observer.observe(link);
    }
  };
  observe(document.body);
  const mutation = new MutationObserver((records) => {
    if (stopped || routes.size >= 12) return;
    let removed = false;
    for (const record of records) {
      // Highlighting can insert thousands of spans; none can be a navigation link.
      if (record.target instanceof Element && record.target.closest(excluded)) continue;
      removed ||= record.removedNodes.length > 0;
      for (const node of record.addedNodes) if (node instanceof Element) observe(node);
    }
    if (removed)
      for (const link of observed)
        if (!link.isConnected) {
          observer.unobserve(link);
          observed.delete(link);
        }
  });
  mutation.observe(document.body, { childList: true, subtree: true });
  return () => {
    stopped = true;
    cancelIdle?.();
    queued.length = 0;
    observed.clear();
    observer.disconnect();
    mutation.disconnect();
  };
}

/** Pointer intent replaces capture-phase mouseenter, which repeats for every child of a link. */
export function setupHoverPrefetch(routeFromHref: RouteFromHref, prefetch: Prefetch) {
  let target: HTMLAnchorElement | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const cancel = () => {
    clearTimeout(timer);
    timer = undefined;
    target = null;
  };
  const over = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    const link =
      event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
    if (link === target) return;
    cancel();
    if (!link || link.closest(excluded) || link.hasAttribute("download") || link.target) return;
    const route = routeFromHref(link.href);
    if (!route || route === routeFromHref(location.href)) return;
    target = link;
    timer = setTimeout(() => {
      timer = undefined;
      if (link.isConnected)
        void Promise.resolve()
          .then(() => (target === link && link.isConnected ? prefetch(route) : undefined))
          .catch(() => undefined);
    }, 100);
  };
  const out = (event: PointerEvent) => {
    if (event.relatedTarget instanceof Node && target?.contains(event.relatedTarget)) return;
    cancel();
  };
  document.addEventListener("pointerover", over, { passive: true });
  document.addEventListener("pointerout", out, { passive: true });
  return () => {
    cancel();
    document.removeEventListener("pointerover", over);
    document.removeEventListener("pointerout", out);
  };
}
