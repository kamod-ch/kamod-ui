const entryKey = "kamodScrollEntry";
const positions = new Map<string, number>();
let restoringEntry: string | undefined;
let restoreRevision = 0;
const currentEntry = (): string | undefined => {
  const key: unknown = history.state?.[entryKey];
  return typeof key === "string" ? key : undefined;
};
const remember = (key: string, top: number) => {
  positions.delete(key);
  positions.set(key, Math.max(0, top));
  // Keep recent Back/Forward positions without retaining an unbounded browsing session.
  if (positions.size > 80) positions.delete(positions.keys().next().value!);
};
const identifyEntry = () => {
  let key = currentEntry();
  if (!key) {
    key = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    history.replaceState({ ...history.state, [entryKey]: key }, "");
  }
  if (!positions.has(key)) {
    const saved: unknown = history.state?.ppScrollY;
    remember(key, typeof saved === "number" && Number.isFinite(saved) ? saved : window.scrollY);
  }
  return key;
};

/** Synchronous in-memory capture also covers an explicit save immediately before navigation. */
export function rememberScrollPosition(top: number) {
  if (typeof window !== "undefined" && Number.isFinite(top)) remember(identifyEntry(), top);
}

/** Back may occur before the debounced history write; use that entry's freshest position. */
export function readRememberedScrollPosition(fallback: number) {
  if (typeof window === "undefined") return fallback;
  const key = currentEntry();
  return key ? (positions.get(key) ?? fallback) : fallback;
}

/** Called after the router actually restores layout, not merely after popstate was dispatched. */
export function finishScrollRestoration() {
  restoreRevision++;
  restoringEntry = undefined;
  rememberScrollPosition(window.scrollY);
}

/** A delayed image/layout wait must not scroll or update a newer history entry. */
export function guardScrollRestoration() {
  const key = identifyEntry();
  const revision = ++restoreRevision;
  return () => currentEntry() === key && revision === restoreRevision;
}

/** Save after a scroll burst; explicit navigation saves remain synchronous in the router. */
export function connectScrollPersistence(persist: () => void) {
  if (typeof window === "undefined") return () => {};
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  identifyEntry();
  const pathname = location.pathname;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const cancel = () => {
    clearTimeout(timer);
    timer = undefined;
  };
  const save = (key = currentEntry()) => {
    cancel();
    if (key !== currentEntry() || key === restoringEntry) return;
    persist();
  };
  const scroll = () => {
    const key = currentEntry();
    if (!key || key === restoringEntry) return;
    remember(key, window.scrollY);
    cancel();
    timer = setTimeout(() => save(key), 150);
  };
  const popstate = () => {
    // Runs before the router's listener: its effect cleanup can be several frames later.
    cancel();
    restoreRevision++;
    const existing = currentEntry();
    const key = identifyEntry();
    // Synthetic search navigation creates an unkeyed entry and intentionally skips restore.
    restoringEntry = existing ? key : undefined;
  };
  const hashchange = () => {
    if (location.pathname !== pathname) return;
    cancel();
    restoreRevision++;
    identifyEntry();
    // Same-page anchors do not remount the router effect. Native/guide anchor scrolling
    // owns their destination; resume recording its resulting scroll event normally.
    restoringEntry = undefined;
  };
  const pagehide = () => save();
  const interact = () => {
    restoringEntry = undefined;
    restoreRevision++;
  };
  window.addEventListener("scroll", scroll, { passive: true });
  window.addEventListener("pagehide", pagehide);
  window.addEventListener("popstate", popstate, true);
  window.addEventListener("hashchange", hashchange, true);
  const intentEvents = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
  for (const event of intentEvents) window.addEventListener(event, interact, { passive: true });
  return () => {
    // The router already saved the outgoing entry before changing history. A late
    // teardown write would otherwise belong to the destination's history entry.
    cancel();
    window.removeEventListener("scroll", scroll);
    window.removeEventListener("pagehide", pagehide);
    window.removeEventListener("popstate", popstate, true);
    window.removeEventListener("hashchange", hashchange, true);
    for (const event of intentEvents) window.removeEventListener(event, interact);
  };
}
