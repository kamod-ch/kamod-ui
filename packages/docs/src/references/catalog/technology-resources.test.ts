import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import help from "virtual:kamod-code-reference-help";
import { expect, it } from "vitest";
import {
  collectTechnologyResources,
  isTechnologyResourceSource,
} from "../../../.preactpress/technology-project-resources";
import {
  technologySnapshotFile,
  technologySnapshots,
} from "../../../.preactpress/technology-reference-snapshots";

const technology = {
  name: "Tailwind",
  aliases: ["Tailwind CSS", "tailwindcss"],
  href: "https://tailwindcss.com/",
};

it("indexes discussing pages and every distinct official link while excluding unrelated destinations", () => {
  const resources = collectTechnologyResources(
    [
      {
        file: "setup.tsx",
        href: "/docs/getting-started",
        title: "Getting Started",
        source:
          'Use <code>Tailwind CSS v4</code>. <a href="https://tailwindcss.com/docs/theme">Theme</a><a href="https://unrelated.example/">Other</a>',
      },
      {
        file: "reference.tsx",
        source:
          'const href = "https://tailwindcss.com/docs/detecting-classes-in-source-files"; // No name required for an exact official resource.',
      },
      { file: "duplicate.md", source: "[Themes](https://tailwindcss.com/docs/theme)" },
      {
        file: "not-related.md",
        href: "/docs/other",
        source: "Tailwinder https://tailwindcss.com.evil.example/",
      },
    ],
    [technology],
  )["technology:tailwind"];
  expect(resources.map(({ href }) => href).sort()).toEqual([
    "/docs/getting-started",
    "https://tailwindcss.com/docs/detecting-classes-in-source-files",
    "https://tailwindcss.com/docs/theme",
  ]);
  expect(resources.find(({ href }) => href.startsWith("/"))?.label).toBe("Getting Started");
});

it("keeps hosted projects within their verified repository boundary", () => {
  const entries = collectTechnologyResources(
    [
      {
        file: "repos.md",
        source:
          "https://github.com/kamod-ch/preactpress/blob/main/README.md https://github.com/kamod-ch/preactpress-other https://github.com/another/project",
      },
    ],
    [{ name: "PreactPress", href: "https://github.com/kamod-ch/preactpress" }],
  );
  expect(entries["technology:preactpress"]).toHaveLength(1);
  expect(entries["technology:preactpress"][0].href).toContain("preactpress/blob/main");
});

it("excludes tests, generated files and local duplicate copies from the authored index", () => {
  for (const path of [
    "packages/docs/src/docs/a.test.tsx",
    "packages/docs/src/docs/generated-navigation.ts",
    "packages/docs/.preactpress/content/theming-foundations 2.md",
    "packages/core/src/code.ts",
  ])
    expect(isTechnologyResourceSource(path), path).toBe(false);
  expect(
    isTechnologyResourceSource("packages/docs/.preactpress/content/theming-foundations.md"),
  ).toBe(true);
  expect(isTechnologyResourceSource("packages/docs/src/docs/pages/theming-doc.tsx")).toBe(true);
});

it("loads project-wide references separately from the saved guide chapters", async () => {
  const [base, references] = await Promise.all([
    help.inlineLoaders!.technology(),
    help.technologyResources!().then((resources) => resources["technology:tailwind"]),
  ]);
  expect(base["technology:tailwind"].sections).toHaveLength(3);
  const destinations = references.map(({ href }) => href);
  expect(destinations).toContain("/docs/getting-started");
  expect(destinations).toContain("/docs/theming/installation");
  expect(destinations).toContain("https://tailwindcss.com/docs/theme");
  expect(new Set(destinations).size).toBe(destinations.length);
});

it("reads edited private snapshots instead of retaining startup configuration data", () => {
  const root = mkdtempSync(join(tmpdir(), "kamod-technology-snapshot-"));
  try {
    const file = technologySnapshotFile(root);
    mkdirSync(dirname(file), { recursive: true });
    const write = (title: string) =>
      writeFileSync(
        file,
        JSON.stringify({
          schemaVersion: 1,
          profiles: {
            Tailwind: { reviewedAt: "2026-10-19", sections: [{ title }], resources: [] },
          },
        }),
      );
    write("Install with Vite");
    expect(technologySnapshots(root).Tailwind.sections[0].title).toBe("Install with Vite");
    write("Updated installation guide");
    expect(technologySnapshots(root).Tailwind.sections[0].title).toBe("Updated installation guide");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
