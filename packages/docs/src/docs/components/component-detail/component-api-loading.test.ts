import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ComponentTypeDefinition } from "./component-api";

const fixtures = vi.hoisted(() => ({ active: vi.fn(), unrelated: vi.fn() }));
vi.mock("virtual:kamod-component-api", () => ({
  sources: {},
  loaders: { active: fixtures.active, unrelated: fixtures.unrelated },
}));

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe("component API loading", () => {
  it("loads only the requested component once and exposes it before navigation can render", async () => {
    let resolve!: (entries: ComponentTypeDefinition[]) => void;
    fixtures.active.mockReturnValue(
      new Promise<ComponentTypeDefinition[]>((done) => {
        resolve = done;
      }),
    );
    const { loadComponentApi, componentApiTypes } = await import("./component-api");
    const first = loadComponentApi("active");
    expect(loadComponentApi("active")).toBe(first);
    expect(fixtures.unrelated).not.toHaveBeenCalled();
    const entries: ComponentTypeDefinition[] = [
      {
        name: "ActiveProps",
        source: "export type ActiveProps = {};",
        filePath: "active.ts",
        exported: true,
        description: "",
        fields: [],
      },
    ];
    resolve(entries);
    await first;
    expect(componentApiTypes("active")).toBe(entries);
    await loadComponentApi("active");
    expect(fixtures.active).toHaveBeenCalledTimes(1);
  });

  it("retries failed requests and safely skips pages without component declarations", async () => {
    fixtures.active.mockRejectedValueOnce(new Error("Offline")).mockResolvedValueOnce([]);
    const { loadComponentApi } = await import("./component-api");
    await expect(loadComponentApi("active")).rejects.toThrow("Offline");
    await expect(loadComponentApi("active")).resolves.toBeUndefined();
    await expect(loadComponentApi("package-guide")).resolves.toBeUndefined();
    expect(fixtures.active).toHaveBeenCalledTimes(2);
    expect(fixtures.unrelated).not.toHaveBeenCalled();
  });
});
