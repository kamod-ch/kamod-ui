/** @vitest-environment jsdom */
import { act, cleanup, renderHook, waitFor } from "@testing-library/preact";
import { afterEach, expect, it, vi } from "vitest";
import { blockCategories } from "./block-categories";
import { usePromptSources } from "./usePromptSources";

afterEach(cleanup);
const block = {
  ...blockCategories.sidebar.blocks[0],
  files: blockCategories.sidebar.blocks[0].files.slice(0, 2),
};

it("rejects an incomplete bundle, then retries every required file", async () => {
  const load = vi
    .fn()
    .mockResolvedValueOnce("// entry")
    .mockRejectedValueOnce(new Error("offline"));
  const { result } = renderHook(() => usePromptSources(block, load));
  await waitFor(() => expect(result.current.result).toEqual({ error: true }));
  load.mockResolvedValue("// complete");
  act(() => result.current.retry());
  await waitFor(() => expect(result.current.result?.sources).toHaveLength(2));
  expect(load).toHaveBeenCalledTimes(4);
});

it("ignores a late result from the previous loader and keeps registry order", async () => {
  let resolve!: (code: string) => void;
  const pending = new Promise<string>((done) => {
    resolve = done;
  });
  const old = vi.fn(() => pending);
  const next = vi.fn(async (label: string) => `// ${label}`);
  const { result, rerender, unmount } = renderHook(({ load }) => usePromptSources(block, load), {
    initialProps: { load: old as (label: string) => Promise<string> },
  });
  rerender({ load: next });
  await waitFor(() => expect(result.current.result?.sources?.[0].code).toBe("// sidebar-01.tsx"));
  await act(async () => resolve("// stale"));
  expect(result.current.result?.sources?.map((source) => source.code)).toEqual([
    "// sidebar-01.tsx",
    "// index.ts",
  ]);
  unmount();
});

it("does not offer a prompt when a loader returns empty source", async () => {
  const empty = async () => "";
  const { result } = renderHook(() => usePromptSources(block, empty));
  await waitFor(() => expect(result.current.result).toEqual({ error: true }));
});
