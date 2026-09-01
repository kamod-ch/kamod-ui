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
    "Install @kamod-ch/i18n for the framework-independent core. Add Preact when using @kamod-ch/i18n/preact.",
  usageText:
    "Define a default locale object as your schema, add locales with satisfies Messages<typeof en>, then call t(), setLocale(), and Intl formatters on a createI18n instance.",
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
