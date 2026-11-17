export type ConsentStorage = {
  get(key: string): string | null;
  set(key: string, value: string): void;
};

export type ConsentState = {
  version: string;
  decidedAt: string;
  categories: Record<string, boolean>;
};

export type ConsentCategoryShape = {
  id: string;
  required?: boolean;
  defaultEnabled?: boolean;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** localStorage adapter. Reads and writes are guarded so private mode and SSR do not throw. */
export const localStorageConsentStorage: ConsentStorage = {
  get(key) {
    if (typeof localStorage === "undefined") return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    if (typeof localStorage === "undefined") return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // Quota or privacy settings can reject the write. The in-memory decision still stands.
    }
  },
};

/** Returns a decision only when the payload matches this version and every category. */
export const readConsent = (
  storage: ConsentStorage,
  key: string,
  version: string,
  categories: readonly ConsentCategoryShape[],
): ConsentState | null => {
  let raw: string | null;
  try {
    raw = storage.get(key);
  } catch {
    return null;
  }
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return null;
    if (parsed.version !== version) return null;
    if (typeof parsed.decidedAt !== "string" || parsed.decidedAt.length === 0) return null;
    if (!isRecord(parsed.categories)) return null;

    const next: Record<string, boolean> = {};
    for (const category of categories) {
      const value = parsed.categories[category.id];
      if (typeof value !== "boolean") return null;
      next[category.id] = category.required ? true : value;
    }
    return { version, decidedAt: parsed.decidedAt, categories: next };
  } catch {
    return null;
  }
};

export const writeConsent = (storage: ConsentStorage, key: string, state: ConsentState) => {
  try {
    storage.set(key, JSON.stringify(state));
  } catch {
    // A throwing adapter must not block the decision already held in memory.
  }
};

export const draftForCategories = (
  categories: readonly ConsentCategoryShape[],
  saved: ConsentState | null,
): Record<string, boolean> => {
  const next: Record<string, boolean> = {};
  for (const category of categories) {
    if (category.required) {
      next[category.id] = true;
      continue;
    }
    const stored = saved?.categories[category.id];
    next[category.id] = typeof stored === "boolean" ? stored : (category.defaultEnabled ?? false);
  }
  return next;
};
