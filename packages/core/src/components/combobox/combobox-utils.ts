/** Flatten grouped `{ items: T[] }[]` shapes into leaf rows for selection lookup. */
export function flattenComboboxItems(items: readonly unknown[]): unknown[] {
  const out: unknown[] = [];
  for (const el of items) {
    if (el !== null && typeof el === "object" && "items" in el) {
      const sub = (el as { items: unknown }).items;
      if (Array.isArray(sub)) {
        out.push(...sub);
        continue;
      }
    }
    out.push(el);
  }
  return out;
}

export function defaultComboboxItemKey(item: unknown): string {
  if (typeof item === "string" || typeof item === "number") return String(item);
  if (item && typeof item === "object" && "value" in item) {
    const v = (item as { value: unknown }).value;
    return v === undefined || v === null ? "" : String(v);
  }
  return JSON.stringify(item);
}

export function defaultComboboxItemString(item: unknown, custom?: (item: unknown) => string): string {
  if (custom) return custom(item);
  if (typeof item === "string") return item;
  if (item && typeof item === "object" && "label" in item) {
    const l = (item as { label: unknown }).label;
    return l === undefined || l === null ? "" : String(l);
  }
  return String(item);
}
