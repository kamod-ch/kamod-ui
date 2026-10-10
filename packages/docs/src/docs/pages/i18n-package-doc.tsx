import { createPackageTeaserDoc } from "./kamod-package-doc-factory";

export const i18nDocPage = createPackageTeaserDoc({
  slug: "i18n-package",
  title: "i18n",
  packagePath: "@kamod-ch/i18n",
  command: "pnpm add @kamod-ch/i18n",
  eyebrow: "kamod-i18n · Typed keys · Zero runtime deps",
  headline: "Ship multilingual Preact apps with a tiny, typed i18n core",
  lead: "Type-safe translation lookup, pluralization via Intl.PluralRules, and formatting through native Intl APIs — with an optional Preact adapter and SSR-safe instances.",
  stats: [
    { value: "0", label: "runtime deps in core" },
    { value: "Intl", label: "native formatting" },
    { value: "TS", label: "schema from default locale" },
  ],
  features: [
    {
      title: "Default-locale-as-schema",
      text: "Nested translation keys are inferred from your default locale so typos fail at compile time.",
    },
    {
      title: "Preact-native adapter",
      text: "I18nProvider and useI18n live in @kamod-ch/i18n/preact without React compatibility layers.",
    },
    {
      title: "SSR-safe core",
      text: "Create one i18n instance per request — no global mutable locale state leaking across users.",
    },
  ],
  quickStart: {
    import: `import { createI18n, type Messages } from "@kamod-ch/i18n";`,
    usage: `const en = { common: { save: "Save" } } as const;\nconst de = { common: { save: "Speichern" } } satisfies Messages<typeof en>;\n\nconst i18n = createI18n({ locale: "en", fallbackLocale: "en", messages: { en, de } });\ni18n.t("common.save");`,
  },
  installationText:
    "**Start with the translation core.** Install `@kamod-ch/i18n` for message lookup and locale-aware formatting without tying that code to a UI framework. For reactive Preact components, also provide Preact and import the adapter from `@kamod-ch/i18n/preact`; the adapter is included in the same package.\n\n**Keep the first setup easy to verify.** Prepare one default locale and one additional language, then try the [Usage Example](#usage) before adding lazy loading or persisted language preferences. If your app renders on the server, plan the instance boundary using [Account for the Environment](#environment-boundaries).",
  usageText:
    "**Let the default language define the message shape.** Create the translation instance with `createI18n` and your locale objects, and use `satisfies Messages<typeof en>` to check that another language has the expected structure. The first example looks up a complete message by its stable key, keeping translation content separate from component markup.\n\n**Connect language changes to the interface.** For Preact consumers, pair `I18nProvider` with `useI18n` through the adapter and consult the [API Reference](#api-reference) for reactive locale updates. The [Named Values Example](#put-it-to-work) shows how to insert data without joining sentence fragments. When switching languages, also review document language, accessible labels and formatting in the [Accessibility Notes](#accessibility).",
  apiReferenceText:
    "This page is a Kamod UI overview. Full API docs, lazy locale loading, plural rules, and SSR guides live on the dedicated kamod-i18n docs.",
  accessibilityText:
    "When switching locale, update lang on the document or region root and keep translated strings in accessible names, labels, and live regions.",
  externalDocsUrl: "https://kamod-ch.github.io/kamod-i18n/",
  githubUrl: "https://github.com/kamod-ch/kamod-i18n",
  npmUrl: "https://www.npmjs.com/package/@kamod-ch/i18n",
  externalCtaTitle: "Browse guides, API, and Preact examples",
  externalCtaDescription:
    "Open the kamod-i18n docs for getting started, lazy locales, pluralization, and SSR patterns.",
});
