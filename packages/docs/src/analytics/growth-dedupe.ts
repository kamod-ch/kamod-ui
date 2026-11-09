const recent = new Map<string, number>();

/** Suppress duplicate emissions from double listeners or rapid re-renders (same key within windowMs). */
export function shouldEmitGrowthEvent(dedupeKey: string, windowMs = 800): boolean {
  const now = Date.now();
  const last = recent.get(dedupeKey);
  if (last != null && now - last < windowMs) return false;
  recent.set(dedupeKey, now);
  if (recent.size > 200) {
    for (const [key, at] of recent) {
      if (now - at > 60_000) recent.delete(key);
    }
  }
  return true;
}

const sessionOnceKeys = new Set<string>();

export function shouldEmitGrowthEventOncePerSession(sessionKey: string): boolean {
  if (sessionOnceKeys.has(sessionKey)) return false;
  sessionOnceKeys.add(sessionKey);
  return true;
}

export function resetGrowthDedupeForTests() {
  recent.clear();
  sessionOnceKeys.clear();
}
