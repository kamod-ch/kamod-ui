import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import help from "virtual:kamod-code-reference-help";
import identities from "virtual:kamod-code-references";
import { expect, it } from "vitest";
import { technologyReferenceSections } from "../../../.preactpress/technology-reference-sections";
import { technologies } from "./technologies";

it("saves two substantial, independently useful sections for every technology in the lazy family", async () => {
  const entries = await help.inlineLoaders!.technology();
  expect(Object.keys(entries)).toHaveLength(technologies.length);
  for (const { name } of technologies) {
    const reference = entries[`technology:${name.toLowerCase()}`];
    expect(reference?.sections, name).toHaveLength(2);
    const titles = new Set<string>();
    for (const section of reference.sections!) {
      titles.add(section.title);
      expect(section.description?.length, `${name}: ${section.title}`).toBeGreaterThan(70);
      expect(section.code?.value || section.rows?.length, name).toBeTruthy();
      if (section.rows) expect(section.rows.length, name).toBeGreaterThanOrEqual(2);
      expect(section.source?.href, name).toMatch(/^(?:https:\/\/|\/docs\/)/);
      const [path, anchor] = section.source!.href.split("#");
      if (path.startsWith("/docs/")) {
        expect(identities.inline.routes[path], `${name}: ${path}`).toBeDefined();
        if (anchor) expect(identities.inline.routes[path], `${name}: ${anchor}`).toContain(anchor);
      }
    }
    expect(titles.size, name).toBe(2);
  }
  // The main navigation can identify a technology without shipping any of its prose or examples.
  const eager = JSON.stringify(identities.inline);
  expect(eager).not.toContain("Render from state");
  expect(eager).not.toContain('"sections":');
  expect(eager).not.toContain('"description":');
});

it("rejects an unauthored profile instead of quietly inventing generic technology content", () => {
  expect(() => technologyReferenceSections("Unreviewed tool", "https://example.com")).toThrow(
    "Missing saved technology reference sections",
  );
  expect(() => technologyReferenceSections("constructor", "https://example.com")).toThrow();
});

it("accounts for every direct external technology dependency in the workspace manifests", () => {
  const root = resolve(import.meta.dirname, "../../../../..");
  const paths = [
    resolve(root, "package.json"),
    ...readdirSync(resolve(root, "packages")).map((name) =>
      resolve(root, "packages", name, "package.json"),
    ),
  ];
  const names = new Set(technologies.map(({ name }) => name));
  const owners: Record<string, string> = {
    "@arethetypeswrong/cli": "Are the Types Wrong",
    "@axe-core/playwright": "axe-core",
    "@biomejs/biome": "Biome",
    "@blobatar/preact": "Blobatar",
    "@formisch/preact": "Formisch",
    "@openuidev/react-lang": "OpenUI",
    "@playwright/test": "Playwright",
    "@preact/preset-vite": "Vite",
    "@preact/signals": "Preact Signals",
    "@tailwindcss/forms": "Tailwind",
    "@tailwindcss/vite": "Tailwind",
    "@testing-library/jest-dom": "Testing Library",
    "@testing-library/preact": "Testing Library",
    "@typescript/typescript6": "TypeScript",
    "@vitest/coverage-v8": "Vitest",
    blobatar: "Blobatar",
    "embla-carousel": "Embla Carousel",
    "lucide-preact": "Lucide",
    motion: "Motion",
    preact: "Preact",
    prismjs: "Prism.js",
    tailwindcss: "Tailwind",
    "tailwind-variants": "Tailwind Variants",
    typescript: "TypeScript",
    valibot: "Valibot",
    zod: "Zod",
  };
  const lowercase = new Map([...names].map((name) => [name.toLowerCase(), name]));
  for (const path of paths) {
    const manifest = JSON.parse(readFileSync(path, "utf8"));
    for (const dependency of Object.keys({
      ...manifest.dependencies,
      ...manifest.devDependencies,
      ...manifest.peerDependencies,
    })) {
      // Workspace/ecosystem packages have their own package references; declaration packages
      // describe their underlying technology instead of introducing another product family.
      if (dependency.startsWith("@kamod-ch/") || dependency.startsWith("@types/")) continue;
      expect(names.has(owners[dependency] ?? lowercase.get(dependency) ?? ""), dependency).toBe(
        true,
      );
    }
  }
});
