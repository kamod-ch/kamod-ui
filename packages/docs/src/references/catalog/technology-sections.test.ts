import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import help from "virtual:kamod-code-reference-help";
import identities from "virtual:kamod-code-references";
import { expect, it } from "vitest";
import { technologyReferenceResources } from "../../../.preactpress/technology-reference-resources";
import { technologyReferenceSections } from "../../../.preactpress/technology-reference-sections";
import { technologies } from "./technologies";

it("saves at least two independently useful sections for every technology in the lazy family", async () => {
  const entries = await help.inlineLoaders!.technology();
  expect(Object.keys(entries)).toHaveLength(technologies.length);
  for (const { name } of technologies) {
    const reference = entries[`technology:${name.toLowerCase()}`];
    expect(reference?.sections?.length, name).toBeGreaterThanOrEqual(2);
    expect(
      reference?.facts?.some(({ label }) => label === "Role"),
      name,
    ).not.toBe(true);
    const titles = new Set<string>();
    for (const section of reference.sections!) {
      titles.add(section.title);
      expect(section.description?.length, `${name}: ${section.title}`).toBeGreaterThan(70);
      expect(
        section.code?.value ||
          section.rows?.length ||
          section.excerpts?.some(({ code }) => code?.value),
        name,
      ).toBeTruthy();
      if (section.rows) expect(section.rows.length, name).toBeGreaterThanOrEqual(2);
      expect(section.source?.href, name).toMatch(/^(?:https:\/\/|\/docs\/)/);
      const [path, anchor] = section.source!.href.split("#");
      if (path.startsWith("/docs/")) {
        expect(identities.inline.routes[path], `${name}: ${path}`).toBeDefined();
        if (anchor) expect(identities.inline.routes[path], `${name}: ${anchor}`).toContain(anchor);
      }
    }
    expect(titles.size, name).toBe(reference.sections!.length);
  }
  // The main navigation can identify a technology without shipping any of its prose or examples.
  const eager = JSON.stringify(identities.inline);
  expect(eager).not.toContain("Render from state");
  expect(eager).not.toContain('"sections":');
  expect(eager).not.toContain('"description":');
});

it("preserves complete authored setup examples and official continuations for the requested tools", async () => {
  const entries = await help.inlineLoaders!.technology();
  for (const name of ["Tailwind", "Vite", "Valibot"]) {
    const reference = entries[`technology:${name.toLowerCase()}`];
    expect(reference.sections, name).toHaveLength(3);
    expect(reference.related, name).toEqual(
      expect.arrayContaining(technologyReferenceResources(name)),
    );
    // Each snippet fits the miniature's nine-line window, including complete config and schema braces.
    for (const section of reference.sections!) {
      const codes = [section.code, ...(section.excerpts?.map(({ code }) => code) ?? [])].filter(
        Boolean,
      );
      for (const code of codes)
        expect(code!.value.split("\n").length, section.title).toBeLessThanOrEqual(9);
      for (const excerpt of section.excerpts ?? [])
        expect(excerpt.source?.href).toBe(section.source?.href);
    }
  }
  const vite = entries["technology:vite"].sections!;
  expect(vite[0].code?.value).toContain("npx vite build\nnpx vite preview");
  expect(vite[0].note).toContain("`vite optimize` is deprecated");
  expect(vite[2].code?.value).toContain("environments:");
  const valibot = entries["technology:valibot"].sections!.at(-1)!;
  expect(valibot.excerpts?.map(({ code }) => code?.value).join("\n")).toContain(
    "v.safeParse(LoginSchema",
  );
  expect(technologyReferenceResources("constructor")).toEqual([]);
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
