type Task = { start: () => void; state: "queued" | "active" | "done" };
type Schedule = (callback: () => void) => () => void;

function whenIdle(callback: () => void) {
  if (typeof requestIdleCallback === "function") {
    const id = requestIdleCallback(callback, { timeout: 250 });
    return () => cancelIdleCallback(id);
  }
  const id = setTimeout(callback, 50);
  return () => clearTimeout(id);
}

/** Bound preview initialization; cancellation releases queued work and occupied slots. */
export function createPreviewLoadQueue(schedule: Schedule = whenIdle, limit = 1) {
  const waiting = new Set<Task>();
  let active = 0;
  let draining = false;
  let cancelIdle: (() => void) | undefined;
  const request = () => {
    if (!waiting.size) {
      cancelIdle?.();
      cancelIdle = undefined;
    } else if (!draining && !cancelIdle && active < limit) {
      cancelIdle = schedule(() => {
        cancelIdle = undefined;
        draining = true;
        try {
          while (active < limit && waiting.size) {
            const task = waiting.values().next().value!;
            waiting.delete(task);
            task.state = "active";
            active++;
            try {
              task.start();
            } catch (error) {
              if (task.state === "active") active--;
              task.state = "done";
              throw error;
            }
          }
        } finally {
          draining = false;
          request();
        }
      });
    }
  };
  return {
    enqueue(start: () => void) {
      const task: Task = { start, state: "queued" };
      waiting.add(task);
      request();
      return () => {
        if (task.state === "done") return;
        if (task.state === "active") active--;
        waiting.delete(task);
        task.state = "done";
        request();
      };
    },
  };
}

// One budget per document; constructing it performs no browser work during SSR.
export const previewLoadQueue = createPreviewLoadQueue();
