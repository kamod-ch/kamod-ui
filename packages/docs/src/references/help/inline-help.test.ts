import { beforeEach, expect, it, vi } from "vitest";
import type {
  CodeReferenceHelp,
  CodeReferenceHelpCatalog,
  CodeReferenceHelpRequest,
} from "../types";

beforeEach(() => vi.resetModules());
const request: CodeReferenceHelpRequest = {
  label: "preact",
  module: "Preact",
  referenceId: "technology:preact",
  href: "https://preactjs.com/",
};
const facts: CodeReferenceHelp = {
  kind: "technology",
  name: "Preact",
  module: "Preact",
  description: "UI library.",
  related: [{ label: "Guide", href: "/docs/getting-started", kind: "guide" }],
};

it("shares in-flight family requests across labels without loading other families", async () => {
  const { loadInlineReferenceHelp } = await import("./inline-help");
  let release!: (value: Record<string, CodeReferenceHelp>) => void;
  const load = vi.fn(
    () =>
      new Promise<Record<string, CodeReferenceHelp>>((resolve) => {
        release = resolve;
      }),
  );
  const unused = vi.fn();
  const data: CodeReferenceHelpCatalog = {
    packages: {},
    loaders: {},
    inlineLoaders: { technology: load, block: unused },
  };
  const first = loadInlineReferenceHelp(data, request);
  const second = loadInlineReferenceHelp(data, { ...request, label: "PREACT" });
  expect(load).toHaveBeenCalledOnce();
  expect(unused).not.toHaveBeenCalled();
  release({ "technology:preact": facts });
  expect((await first).name).toBe("preact");
  expect((await second).name).toBe("PREACT");
  expect(facts.name).toBe("Preact");
});

it("evicts failed family requests for retry and rejects absent families or identities", async () => {
  const { loadInlineReferenceHelp } = await import("./inline-help");
  const load = vi
    .fn()
    .mockRejectedValueOnce(new Error("Offline"))
    .mockResolvedValue({ "technology:preact": facts });
  const data: CodeReferenceHelpCatalog = {
    packages: {},
    loaders: {},
    inlineLoaders: { technology: load },
  };
  await expect(loadInlineReferenceHelp(data, request)).rejects.toThrow("Offline");
  expect((await loadInlineReferenceHelp(data, request)).kind).toBe("technology");
  expect(load).toHaveBeenCalledTimes(2);
  await expect(
    loadInlineReferenceHelp(data, { ...request, referenceId: "technology:missing" }),
  ).rejects.toThrow("identity");
  await expect(
    loadInlineReferenceHelp(data, { ...request, referenceId: "constructor:bad" }),
  ).rejects.toThrow("family");
});

it("applies a deployment prefix once to lazy family reading links", async () => {
  vi.doMock("../../base-path", () => ({
    basePrefix: () => "/kamod-ui",
    withBasePath: (path: string) => `/kamod-ui${path}`,
  }));
  try {
    const { loadInlineReferenceHelp } = await import("./inline-help");
    const data: CodeReferenceHelpCatalog = {
      packages: {},
      loaders: {},
      inlineLoaders: {
        technology: async () => ({
          "technology:preact": {
            ...facts,
            source: { label: "Existing", href: "/kamod-ui/docs/components" },
            sections: [
              {
                title: "Local chapter",
                source: { label: "Chapter", href: "/docs/getting-started#page-title" },
                definitions: [
                  {
                    name: "Contract",
                    code: "type Contract = string;",
                    source: { label: "Contract", href: "/kamod-ui/docs/components" },
                  },
                  {
                    name: "External",
                    code: "type External = number;",
                    source: { label: "Official", href: "https://preactjs.com/" },
                  },
                ],
              },
            ],
          },
        }),
      },
    };
    const result = await loadInlineReferenceHelp(data, request);
    expect(result.related?.[0].href).toBe("/kamod-ui/docs/getting-started");
    expect(result.source?.href).toBe("/kamod-ui/docs/components");
    expect(result.sections?.[0].source?.href).toBe("/kamod-ui/docs/getting-started#page-title");
    expect(result.sections?.[0].definitions?.map(({ source }) => source?.href)).toEqual([
      "/kamod-ui/docs/components",
      "https://preactjs.com/",
    ]);
  } finally {
    vi.doUnmock("../../base-path");
  }
});
