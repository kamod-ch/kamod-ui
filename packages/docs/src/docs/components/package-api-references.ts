export type PackageApiIcon = "toggle" | "counter" | "storage" | "language" | "state";
type PackageApiReference = { href: string; icon: PackageApiIcon; description: string };
const source = (repository: string, file: string) =>
  `https://github.com/kamod-ch/${repository}/blob/main/packages/core/src/${file}`;

/** Verified companion entrypoints; source, inline icons and help share the same metadata. */
export const packageApiReferences: Readonly<Record<string, PackageApiReference>> = {
  useToggle: {
    href: source("kamod-hooks", "useToggle/index.ts"),
    icon: "toggle",
    description:
      "Own a two-value state and change it through toggle, set, setLeft and setRight actions. The default pair is boolean; inspect the overloads for custom values.",
  },
  useCounter: {
    href: source("kamod-hooks", "useCounter/index.ts"),
    icon: "counter",
    description:
      "Keep a numeric value with increment, decrement, set and reset actions. Optional min and max bounds keep updates within the chosen range.",
  },
  useLocalStorageState: {
    href: source("kamod-hooks", "useLocalStorageState/index.ts"),
    icon: "storage",
    description:
      "Keep component state in browser local storage. Supply a storage key and an options object; check the shared storage implementation for defaults and serialization behavior.",
  },
  persistedSignal: {
    href: source("kamod-signals", "persistedSignal.ts"),
    icon: "storage",
    description:
      "Create a persistent signal with a key, an initial value and a storage driver. Choose which consumers share the instance before wiring it into the interface.",
  },
  usePersistedSignal: {
    href: source("kamod-signals", "usePersistedSignal.ts"),
    icon: "storage",
    description:
      "Create a persistent signal scoped to a Preact component. The hook retains its controller and disposes it when the component unmounts.",
  },
  createCookieContext: {
    href: source("kamod-signals", "ssr.ts"),
    icon: "storage",
    description:
      "Connect cookie-backed persistence to the server request. Read the request and response contract before sharing a preference between server rendering and hydration.",
  },
  createI18n: {
    href: source("kamod-i18n", "core/create-i18n.ts"),
    icon: "language",
    description:
      "Create a translation instance from locales and their message schema. Keep request-specific language state isolated when rendering on the server.",
  },
  I18nProvider: {
    href: source("kamod-i18n", "preact/provider.tsx"),
    icon: "language",
    description:
      "Provide an i18n instance to a Preact subtree using the package’s Preact adapter. Keep translated controls within the intended provider boundary.",
  },
  useI18n: {
    href: source("kamod-i18n", "preact/provider.tsx"),
    icon: "language",
    description:
      "Read the i18n instance supplied by I18nProvider. Consult the adapter’s locale subscription helpers when a component needs to react to language changes.",
  },
  createAction: {
    href: source("kamod-state", "core/createAction.ts"),
    icon: "state",
    description:
      "Define a named action creator with a matching helper so reducers can narrow the events they handle.",
  },
  createStore: {
    href: source("kamod-state", "core/index.ts"),
    icon: "state",
    description:
      "Create the store that owns reducer state and receives dispatched actions. Follow the exported implementation to inspect its supported options.",
  },
  createStoreContext: {
    href: source("kamod-state", "preact.ts"),
    icon: "state",
    description:
      "Create the Preact provider and hooks that connect a store to its consumers. This is exported from the Preact entrypoint.",
  },
  useStore: {
    href: source("kamod-state", "preact.ts"),
    icon: "state",
    description:
      "Access a context-owned store through the Preact integration. Inspect createStoreContext for the provider and hook contract.",
  },
  useDispatch: {
    href: source("kamod-state", "preact.ts"),
    icon: "state",
    description:
      "Dispatch actions through the store’s Preact context. Keep event handling in the view and state transitions in the reducer.",
  },
  useSelector: {
    href: source("kamod-state", "preact.ts"),
    icon: "state",
    description:
      "Select the store state a Preact consumer needs. Consult createStoreContext for subscriptions and equality behavior.",
  },
};
