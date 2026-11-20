import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "@typescript/typescript6";
import { ROUTE_SKIP_SLUGS } from "./docs-hidden-slugs.mjs";
import { removeStaleComponentRoutes } from "./docs-route-cleanup.mjs";
import { clipPlainText, humanizeRouteId } from "./seo-titles.mjs";
import { writeFormattedIfChanged, writeIfChanged } from "./write-generated.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.resolve(__dirname, "../src/docs/pages");
const outFile = path.resolve(__dirname, "../src/docs/generated-manifest.ts");
const docsDir = path.resolve(__dirname, "../docs");
const repoRoot = path.resolve(__dirname, "../../..");
const llmsSource = path.join(repoRoot, "llms.txt");
const llmsPublic = path.resolve(__dirname, "../public/llms.txt");

const files = (await fs.readdir(pagesDir)).filter((file) => file.endsWith("-doc.tsx"));
const manifest = [];
const docSeo = new Map();
const navigation = [];
const navigationFile = path.resolve(__dirname, "../src/docs/generated-navigation.ts");

const ensureDir = (target) => fs.mkdir(target, { recursive: true });

const writePage = async (target, frontmatter) => {
  await ensureDir(path.dirname(target));
  await writeIfChanged(target, `${frontmatter}\n`);
};

const removeIfExists = async (target) => {
  await fs.rm(target, { recursive: true, force: true });
};

/** Read actual section literals, never IDs inside code snippets or live demos. */
const countVariants = (source, file) => {
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const referenceIds = new Set(["installation", "usage", "api-reference", "accessibility"]);
  // Guide-heavy component pages explicitly distinguish live examples from explanatory sections.
  let exampleIds;
  const findExamples = (node) => {
    if (
      ts.isPropertyAssignment(node) &&
      node.name.getText(ast) === "exampleSectionIds" &&
      ts.isArrayLiteralExpression(node.initializer)
    ) {
      exampleIds = new Set(
        node.initializer.elements.filter(ts.isStringLiteral).map((id) => id.text),
      );
    }
    ts.forEachChild(node, findExamples);
  };
  findExamples(ast);
  let counts;
  const visit = (node) => {
    if (
      ts.isPropertyAssignment(node) &&
      ["sections", "exampleSections"].includes(node.name.getText(ast))
    ) {
      if (!ts.isArrayLiteralExpression(node.initializer)) return;
      counts = { variantCount: 0, motionVariantCount: 0 };
      for (const section of node.initializer.elements) {
        if (!ts.isObjectLiteralExpression(section))
          throw new Error(`Nonliteral section in ${file}`);
        const text = (name) =>
          section.properties.find(
            (prop) => ts.isPropertyAssignment(prop) && prop.name.getText(ast) === name,
          )?.initializer.text;
        const id = text("id");
        if (!id) throw new Error(`Missing section ID in ${file}`);
        if (exampleIds && !exampleIds.has(id)) continue;
        if (referenceIds.has(id) || /rtl/i.test(id) || /rtl/i.test(text("title") ?? "")) continue;
        counts[id === "with-motion" ? "motionVariantCount" : "variantCount"]++;
      }
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(ast);
  return counts ?? {};
};

const literalProp = (ast, node, name) => {
  if (!ts.isObjectLiteralExpression(node)) return;
  for (const prop of node.properties) {
    if (!ts.isPropertyAssignment(prop) || prop.name.getText(ast) !== name) continue;
    const { initializer } = prop;
    if (ts.isStringLiteral(initializer) || ts.isNoSubstitutionTemplateLiteral(initializer)) {
      return initializer.text;
    }
  }
  return undefined;
};

/** Page title, summary, and section copy from the doc object — not ids inside examples. */
const readDocSeo = (source, file) => {
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let page;
  const sections = new Map();
  const visit = (node) => {
    if (ts.isObjectLiteralExpression(node)) {
      const slug = literalProp(ast, node, "slug");
      const title = literalProp(ast, node, "title");
      const usageLabel = literalProp(ast, node, "usageLabel");
      if (slug && title && (usageLabel || literalProp(ast, node, "command"))) {
        page = {
          slug,
          title: literalProp(ast, node, "headline") || title,
          usageLabel: usageLabel || literalProp(ast, node, "lead"),
        };
      }
      const id = literalProp(ast, node, "id");
      const text = literalProp(ast, node, "text");
      if (id && title && text) sections.set(id, { title, text });
    }
    ts.forEachChild(node, visit);
  };
  visit(ast);
  return { page, sections };
};

/** Match oxfmt: a value that contains `"` is written as a single-quoted YAML string. */
const yamlString = (value) => {
  if (!value.includes("\n") && value.includes('"')) return `'${value.replaceAll("'", "''")}'`;
  return JSON.stringify(value);
};

const componentFrontmatter = ({ title, description, slug, section, indexable }) => `---
title: ${yamlString(title)}
description: ${yamlString(description)}
pageKind: component-doc
slug: ${JSON.stringify(slug)}
section: ${JSON.stringify(section)}
sidebar: false
outline: false
${
  indexable
    ? ""
    : `head:
  - ["meta", { "name": "robots", "content": "noindex, follow" }]
`
}---`;

for (const file of files) {
  const source = await fs.readFile(path.join(pagesDir, file), "utf8");
  const slugMatch = source.match(/slug:\s*"([^"]+)"/);
  if (!slugMatch || ROUTE_SKIP_SLUGS.has(slugMatch[1])) continue;

  // Read literal navigation metadata without importing the interactive examples.
  const metadata = source.slice(slugMatch.index);
  const title = metadata.match(/title:\s*"([^"]+)"/)?.[1];
  if (!title) throw new Error(`Missing navigation title in ${file}`);
  const group =
    metadata.match(/navGroup:\s*"([^"]+)"/)?.[1] ??
    (source.includes("createPackageTeaserDoc(")
      ? "packages"
      : source.includes("createMotionDocPage(")
        ? "motion"
        : "components");
  navigation.push({
    slug: slugMatch[1],
    label: metadata.match(/navLabel:\s*"([^"]+)"/)?.[1] ?? title,
    group,
    ...(group === "components" || group === "motion" ? countVariants(source, file) : {}),
  });

  const ids = [...source.matchAll(/id:\s*"([^"]+)"/g)].map((match) => match[1]);
  const seen = new Set();
  const sections = [];

  for (const id of ["installation", "usage", ...ids, "api-reference", "accessibility"]) {
    if (seen.has(id)) continue;
    seen.add(id);
    sections.push(id);
  }

  const slug = slugMatch[1];
  docSeo.set(slug, readDocSeo(source, file));
  manifest.push({ slug, sections });
}

manifest.sort((a, b) => a.slug.localeCompare(b.slug));

await writeFormattedIfChanged(
  outFile,
  `export const docsRouteManifest = ${JSON.stringify(manifest, null, 2)} as const;\n`,
);

navigation.sort((a, b) => a.label.localeCompare(b.label));
await writeFormattedIfChanged(
  navigationFile,
  `// Generated by docs:routes; edit the corresponding docs page metadata.\nexport const docsNavigation = ${JSON.stringify(navigation, null, 2)} as const;\n`,
);

await ensureDir(docsDir);
await removeIfExists(path.join(docsDir, "[slug]"));
await removeIfExists(path.join(docsDir, "[slug].md"));
await removeIfExists(path.join(docsDir, "[slug].paths.ts"));

await writePage(
  path.join(docsDir, "components.md"),
  `---
title: Components
description: Browse all available Kamod UI components.
pageKind: docs-overview
sidebar: false
outline: false
---`,
);

await writePage(
  path.join(docsDir, "forms.md"),
  `---
title: Forms
description: Form guides and patterns for Kamod UI.
pageKind: docs-forms-overview
sidebar: false
outline: false
---`,
);

await writePage(
  path.join(docsDir, "packages.md"),
  `---
title: Packages
description: Standalone Kamod packages — hooks, icons, i18n, and more.
pageKind: docs-packages-overview
sidebar: false
outline: false
---`,
);

for (const doc of manifest) {
  const seo = docSeo.get(doc.slug);
  const pageTitle = seo?.page?.title ?? humanizeRouteId(doc.slug);
  const summary =
    (seo?.page?.usageLabel && clipPlainText(seo.page.usageLabel)) ||
    (pageTitle.includes(" ") ? clipPlainText(pageTitle) : "") ||
    `${pageTitle} for Preact and Tailwind CSS, from Kamod UI.`;
  await writePage(
    path.join(docsDir, `${doc.slug}.md`),
    componentFrontmatter({
      title: pageTitle,
      description: summary,
      slug: doc.slug,
      section: "installation",
      indexable: true,
    }),
  );

  for (const section of doc.sections) {
    const copy = seo?.sections.get(section);
    const sectionTitle = copy?.title ?? humanizeRouteId(section);
    const description =
      (copy?.text && clipPlainText(copy.text)) ||
      `${sectionTitle} for ${pageTitle}. Part of the Kamod UI docs.`;
    await writePage(
      path.join(docsDir, doc.slug, `${section}.md`),
      componentFrontmatter({
        title: `${pageTitle} — ${sectionTitle}`,
        description,
        slug: doc.slug,
        section,
        indexable: false,
      }),
    );
  }
}

const manifestSlugs = new Set(manifest.map((doc) => doc.slug));
await removeStaleComponentRoutes(docsDir, manifestSlugs);

const corePackage = JSON.parse(
  await fs.readFile(path.join(repoRoot, "packages/core/package.json"), "utf8"),
);
const componentApi = JSON.parse(
  await fs.readFile(path.resolve(__dirname, "../src/docs/generated/component-api.json"), "utf8"),
);
const componentSlugs = Object.keys(corePackage.exports)
  .filter(
    (key) =>
      key.startsWith("./") &&
      !key.endsWith(".css") &&
      !key.startsWith("./lib/") &&
      key !== "./utils",
  )
  .map((key) => key.slice(2))
  .sort();
const navBySlug = new Map(navigation.map((item) => [item.slug, item.label]));
const missingPages = componentSlugs.filter((slug) => !navBySlug.has(slug));
if (missingPages.length > 0) {
  throw new Error(
    `Docs navigation is missing core components: ${missingPages.join(", ")}. Add a docs page so the sidebar, search, and llms.txt stay complete.`,
  );
}
const apiSlugs = new Set(componentApi.exports.map((entry) => entry.slug));
const missingApi = componentSlugs.filter((slug) => !apiSlugs.has(slug));
if (missingApi.length > 0) {
  throw new Error(
    `Component API manifest is missing ${missingApi.join(", ")}. Run pnpm docs:components.`,
  );
}
const llmsText = await fs.readFile(llmsSource, "utf8");
const notes = new Map();
for (const line of llmsText.split("\n")) {
  const match = line.match(/^- \[[^\]]+\]\(https:\/\/ui\.kamod\.ch\/docs\/([^)/]+)\)(.*)$/);
  if (match) notes.set(match[1], match[2]);
}
const componentLines = componentSlugs
  .map((slug) => ({ slug, label: navBySlug.get(slug) }))
  .sort((a, b) => a.label.localeCompare(b.label))
  .map(
    ({ slug, label }) => `- [${label}](https://ui.kamod.ch/docs/${slug})${notes.get(slug) ?? ""}`,
  );
const sectionMatch = llmsText.match(/## Components\n\n([\s\S]*?)\n## /);
if (!sectionMatch) throw new Error("llms.txt is missing a Components section");
const preserved = sectionMatch[1].split("\n").filter((line) => {
  const match = line.match(/\/docs\/([^)/]+)\)/);
  return match && !componentSlugs.includes(match[1]);
});
const nextSection = `## Components\n\n${[...componentLines, ...preserved].filter(Boolean).join("\n")}\n\n## `;
const nextLlms = llmsText.replace(/## Components\n\n[\s\S]*?\n## /, nextSection);
await writeIfChanged(llmsSource, nextLlms);
await writeIfChanged(llmsPublic, nextLlms);

const blocksDir = path.resolve(__dirname, "../blocks");

/** Detail pages keep their prose; only slug titles become readable document titles. */
const humanizeBlockDetailTitles = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await humanizeBlockDetailTitles(full);
      continue;
    }
    if (entry.name !== "index.md") continue;
    const source = await fs.readFile(full, "utf8");
    if (!/^pageKind: \S*detail\s*$/m.test(source)) continue;
    const next = source.replace(
      /^(title:\s*)"([a-z0-9]+(?:-[a-z0-9]+)*)"\s*$/m,
      (_match, prefix, id) => `${prefix}${JSON.stringify(humanizeRouteId(id))}`,
    );
    await writeIfChanged(full, next);
  }
};

await humanizeBlockDetailTitles(blocksDir);
