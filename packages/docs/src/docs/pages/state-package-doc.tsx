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
    "**Start with the state model your feature needs.** Install `@kamod-ch/state` in the workspace that owns the store, and keep Preact available when using the context integration. The first example only needs the package’s action and store APIs, so you can understand the state transition before connecting a component tree.\n\n**Choose integrations deliberately.** The Preact adapter is available through `@kamod-ch/state/preact`; `@kamod-ch/state/signals` provides a bridge when your views already use signals. Review [Choose the Right Approach](#choose-your-approach) before adding a bridge, then run the [Usage Example](#usage) with one action and one reducer.",
  usageText:
    "**Follow one event all the way through.** Name it with `createAction`, handle it in a reducer with `.match()`, and pass that reducer to `createStore`. Dispatch the action and inspect the resulting state. Keeping this first transition small makes the action payload and reducer’s responsibility easy to see.\n\n**Add the view after the transition works.** Use `createStoreContext` when a Preact tree needs access to the store, and choose the state each consumer actually reads. The [Typed Store Example](#put-it-to-work) keeps the state and action contract together; [Ownership and Lifetime](#state-and-lifetime) helps you decide where that store instance belongs. Keep network work outside the reducer and model its visible pending, success and failure states explicitly.",
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
