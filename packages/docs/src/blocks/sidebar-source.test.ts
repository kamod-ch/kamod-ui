import { afterEach, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

it("shares pending source requests and retries failed loads", async () => {
  const fetcher = vi
    .fn()
    .mockResolvedValueOnce(new Response("unavailable", { status: 503 }))
    .mockResolvedValue(
      new Response(JSON.stringify({ "sidebar-05.tsx": "page", "index.ts": "entry" })),
    );
  vi.stubGlobal("fetch", fetcher);
  const { getSidebarBlockSource } = await import("./sidebar-source");
  await expect(getSidebarBlockSource("sidebar-05", "index.ts")).rejects.toThrow("503");
  expect(
    await Promise.all([
      getSidebarBlockSource("sidebar-05", "sidebar-05.tsx"),
      getSidebarBlockSource("sidebar-05", "index.ts"),
    ]),
  ).toEqual(["page", "entry"]);
  expect(fetcher).toHaveBeenCalledTimes(2);
  await expect(getSidebarBlockSource("sidebar-05", "missing.tsx")).rejects.toThrow(
    "Block source not found",
  );
  expect(fetcher).toHaveBeenCalledTimes(2);
});

it("retries malformed or incomplete deployment assets", async () => {
  const fetcher = vi
    .fn()
    .mockResolvedValueOnce(new Response("null"))
    .mockResolvedValueOnce(new Response("{}"))
    .mockResolvedValueOnce(new Response(JSON.stringify({ "index.ts": "entry" })));
  vi.stubGlobal("fetch", fetcher);
  const { getSidebarBlockSource } = await import("./sidebar-source");
  await expect(getSidebarBlockSource("sidebar-05", "index.ts")).rejects.toThrow(
    "Invalid source response",
  );
  await expect(getSidebarBlockSource("sidebar-05", "index.ts")).rejects.toThrow(
    "Block source not found",
  );
  await expect(getSidebarBlockSource("sidebar-05", "index.ts")).resolves.toBe("entry");
  expect(fetcher).toHaveBeenCalledTimes(3);
});
