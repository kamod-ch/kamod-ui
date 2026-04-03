/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL zum externen Feedback-Formular (z. B. Tally, Google Forms). */
  readonly VITE_PRO_FEEDBACK_FORM_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
