/**
 * Preact / OpenUI compatibility notes
 *
 * `@openuidev/react-lang` declares a React peer dependency. Kamod apps should
 * alias React to `preact/compat` in the bundler:
 *
 * ```ts
 * resolve: {
 *   alias: [
 *     { find: "react", replacement: "preact/compat" },
 *     { find: "react-dom", replacement: "preact/compat" },
 *     { find: "react/jsx-runtime", replacement: "preact/jsx-runtime" },
 *   ],
 *   dedupe: ["preact", "preact/hooks", "preact/compat"],
 * }
 * ```
 *
 * Do not bundle a separate React runtime alongside Preact.
 */
export const PREACT_COMPAT_ALIAS_HINT =
  "Alias react and react-dom to preact/compat; alias react/jsx-runtime to preact/jsx-runtime.";
