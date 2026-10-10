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
    "**Add persistence to your signals setup.** Install `@kamod-ch/signals` alongside `@preact/signals` and Preact, checking that the versions satisfy the package’s peer requirements. In an existing application, use the same signal runtime already used by your components.\n\n**Decide where the value will live.** The [Usage Example](#usage) starts with a local browser preference. Before choosing a different storage driver, read [Account for the Environment](#environment-boundaries) and the [Driver Reference](#api-reference); browser storage and request-scoped cookies need different setup decisions.",
  usageText:
    "**Give the preference a name, a default and an owner.** Create a `persistedSignal` with a specific storage key and driver, then read or write its `.value`. A shared instance lets several consumers observe the same preference; use `usePersistedSignal` when the instance should follow a component’s lifetime.\n\n**Check the saved value, not just the current screen.** Start with a harmless preference, change it, reload and restore its default. The [Component Preference Example](#put-it-to-work) shows this flow with a versioned key. Review [Ownership and Lifetime](#state-and-lifetime) before moving the signal into a shared module, especially when your application renders on the server.",
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
