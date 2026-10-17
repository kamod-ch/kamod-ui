/** Source is loaded only when the Code or Prompt view needs it. */
export const applicationShellSourceFiles = import.meta.glob<string>(
  [
    "../../../blocks/src/application-shell/application-shell-*/*.{ts,tsx}",
    "../../../blocks/src/application-shell/application-shell-1/assets/*.svg",
    "../../../blocks/src/application-shell/shared/*.{ts,tsx}",
    "!../../../blocks/src/application-shell/**/*.test.{ts,tsx}",
  ],
  { eager: true, query: "?raw", import: "default" },
);

/** Retain the first shell’s flat source contract for existing integrations. */
export const applicationShellSources = Object.fromEntries(
  Object.entries(applicationShellSourceFiles)
    .filter(([path]) => path.includes("/application-shell-1/"))
    .map(([path, code]) => [path.split("/application-shell-1/")[1], code]),
);
