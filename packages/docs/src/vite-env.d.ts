/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL zum externen Feedback-Formular (z.B. Tally, Google Forms). */
  readonly VITE_PRO_FEEDBACK_FORM_URL?: string;
  /** `matomo` sends growth funnel events; `noop` disables them (default in dev / Vitest). */
  readonly VITE_GROWTH_ANALYTICS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "virtual:kamod-code-references" {
  const catalog: {
    repositories: Record<string, string>;
    packageSources: Record<string, string>;
    componentLabels: Record<string, string>;
    files: string[];
    components: Record<string, { slug: string; file: string }>;
    symbols: Record<string, { module: string; imported: string }[]>;
    inline: import("./references/types").InlineReferenceIndex;
  };
  export default catalog;
}

declare module "virtual:kamod-code-reference-help" {
  const catalog: import("./references/types").CodeReferenceHelpCatalog;
  export default catalog;
}
