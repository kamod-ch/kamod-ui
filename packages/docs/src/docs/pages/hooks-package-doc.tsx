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
    usage: `export function useExampleState() {\n  const [on, { toggle }] = useToggle(false);\n  const [count, { inc }] = useCounter(0);\n  const [theme, setTheme] = useLocalStorageState("theme", { defaultValue: "dark" });\n  return { on, toggle, count, inc, theme, setTheme };\n}`,
  },
  installationText:
    "**Add behavior where your screen needs it.** Install `@kamod-ch/hooks` in the application workspace that will import it, with Preact available as its peer dependency. If your app already uses Preact, keep that setup; these hooks work alongside your existing components. The package supplies behavior, while your controls and styles still come from your application.\n\n**Choose an import style you can repeat.** The package root provides named imports such as `useToggle`, `useCounter` and `useLocalStorageState`. Documented subpaths such as `@kamod-ch/hooks/useToggle` provide a default import when you prefer a focused entry point. Both styles are supported; check the built output before choosing one for bundle-size reasons. Continue with the [Usage Example](#usage), or review [Versions and Peer Dependencies](/docs/packages#package-installation) if an import does not resolve.",
  usageText:
    "**Start with one behavior, then connect the control.** Use `useToggle` for an on/off value, `useCounter` for a quantity with optional minimum and maximum bounds, and `useLocalStorageState` for a preference that should survive a reload. Each name links to its implementation so you can inspect the supported options and returned actions before adapting it.\n\n**Read the value; call its actions from an event.** The example groups the three hooks in `useExampleState`, a small custom hook you can call at the top level of a Preact component. Read `on`, `count` and `theme` when rendering; call `toggle()`, `inc()` or `setTheme(nextTheme)` from the relevant event handler. Keep a visible label beside the value so a changed state is understandable.\n\n**Try one change at a time.** Follow [Read the Example](#read-the-example) to unpack the return values, then build the [Bounded Quantity Control](#put-it-to-work). For a saved preference, choose a specific storage key and test both a fresh visit and a reload; `defaultValue` supplies a starting value, not validation for previously stored data. The [Environment Notes](#environment-boundaries) explain where browser-backed behavior needs extra care.",
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
