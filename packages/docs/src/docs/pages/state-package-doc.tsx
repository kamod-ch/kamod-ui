import { createPackageTeaserDoc } from "./kamod-package-doc-factory";

export const stateDocPage = createPackageTeaserDoc({
  slug: "state-package",
  title: "State",
  packagePath: "@kamod-ch/state",
  command: "pnpm add @kamod-ch/state preact",
  eyebrow: "kamod-state · Typed reducers · Preact context",
  headline: "Tiny, typed reducer state management for Preact",
  lead: "createStore and createAction with TypeScript-first action matching, Preact context providers, optional middleware, and a signals bridge — without a React runtime.",
  stats: [
    { value: "TS", label: "typed actions" },
    { value: "Preact", label: "context hooks" },
    { value: "MIT", label: "license" },
  ],
  features: [
    {
      title: "Typed action creators",
      text: "createAction returns creators with .match() so reducers stay narrow and exhaustiveness-friendly.",
    },
    {
      title: "Preact integration",
      text: "createStoreContext wires stores into components with useStore, useDispatch, and useSelector entry points.",
    },
    {
      title: "Optional signals bridge",
      text: "Subscribe store slices through @kamod-ch/state/signals when you already use @preact/signals in the UI.",
    },
  ],
  quickStart: {
    import: `import { createAction, createStore } from "@kamod-ch/state";`,
    usage: `const increment = createAction("counter/increment");\n\nconst store = createStore({\n  reducer: (state = { count: 0 }, action) =>\n    increment.match(action) ? { count: state.count + 1 } : state,\n});\n\nstore.dispatch(increment());`,
  },
  installationText:
    "Install @kamod-ch/state with Preact as a peer dependency when using the Preact context entry points.",
  usageText:
    "Define typed actions, implement a reducer with .match(), create a store, and optionally expose it through createStoreContext for component trees.",
  apiReferenceText:
    "This page is a Kamod UI overview. Full API docs, middleware, testing helpers, and signals integration live on the dedicated kamod-state docs.",
  accessibilityText:
    "When store state drives UI (dialogs, tabs, selections), keep focus management and ARIA state in sync with dispatched actions.",
  externalDocsUrl: "https://kamod-ch.github.io/kamod-state/",
  githubUrl: "https://github.com/kamod-ch/kamod-state",
  npmUrl: "https://www.npmjs.com/package/@kamod-ch/state",
  externalCtaTitle: "Explore API, middleware, and Preact patterns",
  externalCtaDescription:
    "Open the kamod-state docs for getting started, context usage, testing utilities, and the signals bridge.",
});
