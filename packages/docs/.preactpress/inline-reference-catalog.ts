import { inlineReferences } from "../src/docs/components/inline-reference-catalog";
import { technologies } from "../src/references/catalog/technologies";
import type { CodeReferenceHelp, InlineReferenceIndex } from "../src/references/types";
import { buildBlockReferences } from "./inline-reference-blocks";
import { buildReferencePages } from "./inline-reference-pages";
import { technologyReferenceResources } from "./technology-reference-resources";
import { technologyReferenceSections } from "./technology-reference-sections";

const commands: Record<string, string> = {
  pnpm: "https://pnpm.io/cli/run",
  npm: "https://docs.npmjs.com/cli/commands/npm",
  yarn: "https://yarnpkg.com/cli",
  bun: "https://bun.sh/docs",
  npx: "https://docs.npmjs.com/cli/commands/npx",
  pnpx: "https://pnpm.io/cli/dlx",
  bunx: "https://bun.sh/docs/pm/bunx",
  corepack: "https://github.com/nodejs/corepack",
  git: "https://git-scm.com/docs",
  gh: "https://cli.github.com/manual/",
  node: "https://nodejs.org/api/cli.html",
  tsc: "https://www.typescriptlang.org/docs/handbook/compiler-options.html",
  vite: "https://vite.dev/guide/cli",
  vitest: "https://vitest.dev/guide/cli",
  playwright: "https://playwright.dev/docs/test-cli",
  oxlint: "https://oxc.rs/docs/guide/usage/linter/cli",
  oxfmt: "https://oxc.rs/docs/guide/usage/formatter/cli",
  biome: "https://biomejs.dev/reference/cli/",
  docker: "https://docs.docker.com/reference/cli/docker/",
  shadcn: "https://ui.shadcn.com/docs/cli",
};

/** Build-only: collect real route/block identities without importing previews or component runtimes. */
export async function buildInlineReferenceCatalog(root: string) {
  const index: InlineReferenceIndex = { aliases: {}, routes: {}, commands };
  const families: Record<string, Record<string, CodeReferenceHelp>> = {};
  const ambiguous = new Map<string, number>();
  const priority: Record<string, number> = { page: 1, technology: 3, block: 4 };
  const add = (id: string, facts: CodeReferenceHelp, aliases: string[], href: string) => {
    (families[facts.kind] ??= {})[id] = facts;
    for (const label of aliases) {
      const key = label.toLowerCase();
      const rank = priority[facts.kind] ?? 0;
      if ((ambiguous.get(key) ?? -1) >= rank) continue;
      if (index.aliases[key] && index.aliases[key][0] !== id) {
        const previous = priority[index.aliases[key][0].split(":", 1)[0]] ?? 0;
        if (previous > rank) continue;
        if (previous < rank) {
          index.aliases[key] = [id, facts.module, href];
          continue;
        }
        delete index.aliases[key];
        ambiguous.set(key, rank);
      } else index.aliases[key] = [id, facts.module, href];
    }
  };
  for (const entry of technologies) {
    const id = `technology:${entry.name.toLowerCase()}`;
    add(
      id,
      {
        kind: "technology",
        name: entry.name,
        module: entry.name,
        originLabel: "Technology",
        context: entry.category,
        description: entry.description,
        docs: { label: "Official documentation", href: entry.href },
        related: [
          ...technologyReferenceResources(entry.name),
          ...(entry.guide
            ? [{ label: "In Kamod", href: entry.guide, kind: "guide" as const }]
            : []),
        ],
        sections: technologyReferenceSections(entry.name, entry.href),
      },
      [entry.name, ...(entry.aliases ?? [])],
      entry.href,
    );
  }
  const { routes, pages } = await buildReferencePages(root);
  index.routes = routes;
  families.page = pages;
  // Route titles are useful only when unambiguous. Exact component/API exports still win at runtime.
  for (const [id, facts] of Object.entries(families.page))
    add(id, facts, [facts.name], facts.module);
  // Named guide aliases are authored; generic headings such as "Usage" are intentionally not aliases.
  for (const reference of inlineReferences.filter(({ kind }) => kind === "page")) {
    const path = reference.href.split("#")[0];
    const redirect = path.match(/^\/docs\/([^/]+)\/([^/]+)$/);
    const canonical = redirect ? `/docs/${redirect[1]}/installation` : path;
    if (!index.routes[path] && !(redirect && index.routes[canonical]?.includes(redirect[2])))
      continue;
    const id = `page:${index.routes[path] ? path : canonical}`;
    add(id, families.page[id], [reference.label], path);
  }
  for (const record of await buildBlockReferences(root)) {
    add(record.id, record.facts, record.aliases, record.href);
    index.routes[record.href] = [
      ...new Set([...(index.routes[record.href] ?? []), ...record.sections]),
    ];
  }
  for (const [tool, href] of Object.entries(commands))
    add(
      `command:${tool}`,
      {
        kind: "command",
        name: tool,
        module: tool,
        originLabel: "Tool",
        description: `A terminal invocation of ${tool}. Its arguments are displayed as written; the documentation never executes it.`,
        docs: { label: "Command documentation", href },
      },
      [],
      href,
    );
  return { index, families };
}
