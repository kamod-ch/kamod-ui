import { createPackageTeaserDoc } from "./kamod-package-doc-factory";

export const hooksDocPage = createPackageTeaserDoc({
  slug: "hooks-package",
  title: "Hooks",
  packagePath: "@kamod-ch/hooks",
  command: "pnpm add @kamod-ch/hooks preact",
  eyebrow: "kamod-hooks · Preact-first · Typed · Tree-shakeable",
  headline: "Ship Preact features faster with production-ready hooks",
  lead: "A Preact-first hook library inspired by ahooks — state, lifecycle, browser, and async helpers with zero runtime dependencies beyond Preact.",
  stats: [
    { value: "78", label: "documented hooks" },
    { value: "0", label: "runtime deps in core" },
    { value: "TS", label: "published signatures" },
  ],
  features: [
    {
      title: "Preact-first",
      text: "Built for Preact hooks, not React-compat afterthoughts. Import what you need and keep bundles lean.",
    },
    {
      title: "Tree-shakeable",
      text: "ESM package with optional subpath imports like @kamod-ch/hooks/useToggle for tight production builds.",
    },
    {
      title: "Demo-backed docs",
      text: "Every hook ships with interactive demos and copy-ready source on the dedicated live docs site.",
    },
  ],
  quickStart: {
    import: `import { useToggle, useCounter, useLocalStorageState } from "@kamod-ch/hooks";`,
    usage: `const [on, { toggle }] = useToggle(false);\nconst [count, { inc }] = useCounter(0);\nconst [theme, setTheme] = useLocalStorageState("theme", "dark");`,
  },
  installationText:
    "Install @kamod-ch/hooks with Preact as a peer dependency when using the package outside the Kamod UI monorepo.",
  usageText:
    "Start with high-traffic hooks like useToggle, useCounter, and useLocalStorageState. Prefer named imports or subpath imports for tree-shaking.",
  apiReferenceText:
    "This page is a Kamod UI overview. The full API, categorized hook tables, and TypeScript signatures live on the dedicated kamod-hooks docs.",
  accessibilityText:
    "Pair hooks that drive UI (for example toggles, focus, and viewport observers) with clear labels, keyboard affordances, and semantic controls in your components.",
  externalDocsUrl: "https://kamod-ch.github.io/kamod-hooks/",
  githubUrl: "https://github.com/kamod-ch/kamod-hooks",
  npmUrl: "https://www.npmjs.com/package/@kamod-ch/hooks",
  externalCtaTitle: "Browse all 78 hooks with live demos",
  externalCtaDescription:
    "Open the full kamod-hooks docs for getting started, migration from ahooks, and every interactive demo.",
});
