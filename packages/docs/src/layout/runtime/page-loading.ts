/** Share pending metadata requests between navigation, hover and viewport prefetch. */
export function createPageLoader<T>(
  load: (route: string, base: string) => Promise<T>,
  cached: (route: string) => T | undefined,
) {
  const pending = new Map<string, Promise<T>>();
  const loadPage = (route: string, base: string): Promise<T> => {
    const page = cached(route);
    if (page !== undefined) return Promise.resolve(page);
    const key = `${base}\0${route}`;
    const existing = pending.get(key);
    if (existing) return existing;
    const request = load(route, base).finally(() => pending.delete(key));
    pending.set(key, request);
    return request;
  };
  return {
    loadPage,
    // Failures stay retryable and must never become unhandled background rejections.
    prefetchPage: (route: string, base: string) => loadPage(route, base).catch(() => undefined),
  };
}
