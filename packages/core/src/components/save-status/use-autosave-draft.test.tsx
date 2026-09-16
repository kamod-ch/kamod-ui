import { act, renderHook } from "@testing-library/preact";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AutosaveAdapter } from "./save-status-types";
import { useAutosaveDraft } from "./use-autosave-draft";

const deferred = () => {
  let resolve!: () => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe("useAutosaveDraft", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("keeps revision B dirty after save A completes", async () => {
    const pendingA = deferred();
    const pendingB = deferred();
    let call = 0;
    const adapter: AutosaveAdapter = ({ revision }) => {
      call += 1;
      if (revision === 1) return pendingA.promise;
      if (revision === 2) return pendingB.promise;
      return Promise.resolve();
    };

    const { result } = renderHook(() => useAutosaveDraft({ adapter, debounceMs: 100 }));

    act(() => {
      result.current.setContent("A");
    });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.status).toBe("saving");

    act(() => {
      result.current.setContent("B");
    });

    await act(async () => {
      pendingA.resolve();
      await pendingA.promise;
      await Promise.resolve();
    });

    expect(result.current.revision).toBe(2);
    expect(result.current.savedRevision).toBe(1);
    expect(result.current.hasUnsavedChanges).toBe(true);
    expect(result.current.status).toBe("dirty");

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.status).toBe("saving");

    await act(async () => {
      pendingB.resolve();
      await pendingB.promise;
      await Promise.resolve();
    });

    expect(result.current.savedRevision).toBe(2);
    expect(result.current.hasUnsavedChanges).toBe(false);
    expect(result.current.status).toBe("saved");
    expect(call).toBe(2);
  });

  it("ignores stale save failures for older revisions", async () => {
    const pendingA = deferred();
    const adapter: AutosaveAdapter = ({ revision }) => {
      if (revision === 1) return pendingA.promise;
      return Promise.resolve();
    };

    const { result } = renderHook(() => useAutosaveDraft({ adapter, debounceMs: 50 }));

    act(() => {
      result.current.setContent("A");
    });
    act(() => {
      vi.advanceTimersByTime(50);
    });
    act(() => {
      result.current.setContent("B");
    });

    await act(async () => {
      pendingA.reject(new Error("Save A failed"));
      await pendingA.promise.catch(() => undefined);
      await Promise.resolve();
    });

    expect(result.current.status).not.toBe("error");
    expect(result.current.revision).toBe(2);
  });

  it("clears pending debounce timers on unmount", () => {
    const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");
    const adapter: AutosaveAdapter = () => Promise.resolve();

    const { result, unmount } = renderHook(() => useAutosaveDraft({ adapter, debounceMs: 500 }));
    act(() => {
      result.current.setContent("Draft");
    });
    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it("aborts in-flight saves on unmount", () => {
    const abortSpy = vi.spyOn(AbortController.prototype, "abort");
    const adapter: AutosaveAdapter = () => new Promise(() => {});

    const { result, unmount } = renderHook(() => useAutosaveDraft({ adapter, debounceMs: 100 }));
    act(() => {
      result.current.setContent("Draft");
    });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    unmount();
    expect(abortSpy).toHaveBeenCalled();
  });
});
