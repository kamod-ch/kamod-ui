import { createPackageTeaserDoc } from "./kamod-package-doc-factory";

export const signalsDocPage = createPackageTeaserDoc({
  slug: "signals-package",
  title: "Signals",
  packagePath: "@kamod-ch/signals",
  command: "pnpm add @kamod-ch/signals @preact/signals preact",
  eyebrow: "kamod-signals · Persisted state · Familiar .value API",
  headline: "Persisted Preact signals for every storage driver",
  lead: "Reactive state with durable storage — localStorage, sessionStorage, IndexedDB, cookies, and memory — while keeping the familiar @preact/signals .value API.",
  stats: [
    { value: "5", label: "storage drivers" },
    { value: "SSR", label: "cookie context" },
    { value: ".value", label: "signals API" },
  ],
  features: [
    {
      title: "Persistence built in",
      text: "persistedSignal and usePersistedSignal sync reactive values to the driver you choose.",
    },
    {
      title: "Framework friendly",
      text: "Works beside Preact components and plain modules — share state across controllers without prop drilling.",
    },
    {
      title: "SSR-aware cookies",
      text: "createCookieContext and serializeCookie helpers keep cookie-backed signals usable on the server.",
    },
  ],
  quickStart: {
    import: `import { persistedSignal } from "@kamod-ch/signals";`,
    usage: `export const theme = persistedSignal("theme", "dark", { storage: "local" });\n\n// later\ntheme.value = "light";`,
  },
  installationText:
    "Install @kamod-ch/signals with @preact/signals and Preact as peer dependencies when using the package outside the Kamod UI monorepo.",
  usageText:
    "Create a persisted signal with a storage key and driver, then read or write .value as usual. Use usePersistedSignal inside components for scoped instances.",
  apiReferenceText:
    "This page is a Kamod UI overview. Full API docs, driver tables, and SSR cookie examples live on the dedicated kamod-signals docs.",
  accessibilityText:
    "When signals drive UI chrome (theme, sidebar, locale), reflect state in accessible controls and keep preference changes predictable for keyboard and assistive tech users.",
  externalDocsUrl: "https://kamod-ch.github.io/kamod-signals/",
  githubUrl: "https://github.com/kamod-ch/signals",
  npmUrl: "https://www.npmjs.com/package/@kamod-ch/signals",
  externalCtaTitle: "Explore drivers, API, and examples",
  externalCtaDescription:
    "Open the kamod-signals docs for getting started, storage showcases, and SSR cookie guides.",
});
