type Entry = { visible: boolean; ready: boolean; evict: () => void };

/** Keep recent examples warm without retaining every document visited on a long article. */
export function createPreviewRetention(limit = 3) {
  const entries = new Set<Entry>();
  const trim = () => {
    for (const entry of entries) {
      if (entries.size <= limit) break;
      // Never interrupt startup or discard an example that the reader can currently use.
      if (!entry.ready || entry.visible) continue;
      entries.delete(entry);
      entry.evict();
    }
  };
  return {
    retain(evict: () => void, visible: boolean) {
      const entry: Entry = { visible, ready: false, evict };
      entries.add(entry);
      trim();
      return {
        setVisible(visible: boolean) {
          entry.visible = visible;
          if (visible && entries.delete(entry)) entries.add(entry);
          trim();
        },
        complete() {
          entry.ready = true;
          trim();
        },
        release: () => entries.delete(entry),
      };
    },
  };
}

export const previewRetention = createPreviewRetention();
