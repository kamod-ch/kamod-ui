import type { packageGuideNotes } from "./package-guide-notes";

type Recipe = {
  steps: readonly { title: string; code: string; note: string }[];
  title: string;
  introduction: string;
  file: string;
  code: string;
  result: string;
};

/** Small, independent examples complement the overview without reproducing each package's API docs. */
export const packageGuideRecipes = {
  "hooks-package": {
    steps: [
      {
        title: "Separate the value from its actions",
        code: "const [on, { toggle }] = useToggle(false);",
        note: "The first item describes what to render. The second contains operations that change it. Call the hook at the top level of a component or custom hook; call toggle from the event handler, not while rendering.",
      },
      {
        title: "Make the limits part of the behavior",
        code: "const [count, { inc, dec, reset }] = useCounter(1, { min: 1, max: 5 });",
        note: "Put the bounds in the hook and reflect them in the controls. A disabled button explains the boundary visually, while the hook keeps programmatic changes inside the same range.",
      },
      {
        title: "Choose a default for an empty browser",
        code: 'const [theme, setTheme] = useLocalStorageState("theme", { defaultValue: "dark" });',
        note: "The second argument is an options object. A default is used when no saved value exists; it is not a validation rule for old data. Check stored values before treating them as a restricted theme name.",
      },
    ],
    title: "Connect a bounded quantity control",
    introduction:
      "This example keeps behavior local and uses the same Kamod buttons as the rest of the interface. The disabled states explain the limits, and reset returns to the starting quantity. Render it twice to see that each instance owns its own count.",
    file: "src/components/Quantity.tsx",
    code: `import { useCounter } from "@kamod-ch/hooks";
import { Button } from "@kamod-ch/ui";

export function Quantity() {
  const [count, { inc, dec, reset }] = useCounter(1, { min: 1, max: 5 });
  return (
    <div role="group" aria-label="Quantity" class="flex flex-wrap items-center gap-2">
      <Button variant="outline" disabled={count === 1} onClick={() => dec()}>Remove one</Button>
      <output aria-live="polite">{count}</output>
      <Button variant="outline" disabled={count === 5} onClick={() => inc()}>Add one</Button>
      <Button variant="ghost" onClick={reset}>Reset</Button>
    </div>
  );
}`,
    result:
      "Try the minimum, maximum and reset paths with a keyboard. When this becomes a cart control, send the intended quantity through your application boundary and handle server rejection separately; a local count is not proof of available stock.",
  },
  "i18n-package": {
    steps: [
      {
        title: "Let the default locale define the shape",
        code: 'const en = { common: { save: "Save" } } as const;',
        note: "Keep keys stable and organize them by meaning. A key such as common.save can be shared where the action means the same thing; two English labels that happen to match do not always need the same translation key.",
      },
      {
        title: "Check translations while editing",
        code: 'const de = { common: { save: "Speichern" } } satisfies Messages<typeof en>;',
        note: "The satisfies check catches structural mistakes in this object. It cannot judge translation quality or whether a sentence fits the screen. Review the full message with a speaker of the target language and test it in context.",
      },
      {
        title: "Resolve text at the point of use",
        code: 'i18n.t("common.save"); // "Save" for the starting English locale',
        note: "The selected locale determines the lookup. In a reactive interface, use the package's Preact integration so changing language updates consumers; do not cache translated labels once at module initialization.",
      },
    ],
    title: "Translate complete messages with named values",
    introduction:
      "Let a translator control the whole sentence instead of joining a greeting, name and punctuation in the view. Named interpolation keeps the data separate from the message and gives another language room to reorder the words.",
    file: "src/i18n/messages.ts",
    code: `import { createI18n, type Messages } from "@kamod-ch/i18n";

const en = { dashboard: { welcome: "Welcome {name}" } } as const;
const de = { dashboard: { welcome: "Willkommen {name}" } } satisfies Messages<typeof en>;

export function createMessages(locale: "en" | "de") {
  return createI18n({ locale, fallbackLocale: "en", messages: { en, de } });
}

const messages = createMessages("de");
messages.t("dashboard.welcome", { name: "Alex" });`,
    result:
      "Create the instance for the relevant app or request, then use the same locale for dates, numbers and the document language. Render the result as text. Translation content should not become raw HTML merely because it came from a message file.",
  },
  "icons-package": {
    steps: [
      {
        title: "Choose a family deliberately",
        code: 'import { SearchIcon } from "@kamod-ch/icons/shadcn";',
        note: "The subpath is part of the design decision. Check the exact export in the icon catalog and keep related controls in one family; similarly named icons from different families can have different silhouettes and visual weight.",
      },
      {
        title: "Separate the symbol from the target",
        code: '<SearchIcon size={20} aria-hidden="true" />',
        note: "The size controls the SVG, not the clickable area. Give the surrounding button enough padding and an obvious focus state. Increasing the icon itself is not a substitute for a comfortable pointer target.",
      },
      {
        title: "Name the action once",
        code: '<Button aria-label="Search"><SearchIcon size={20} aria-hidden="true" /></Button>',
        note: "An icon-only control needs a name on the button. When visible text already names the action, keep the SVG decorative so screen readers do not announce the same meaning twice. A tooltip can clarify an action but does not replace its accessible name.",
      },
    ],
    title: "Build a consistent search action",
    introduction:
      "Use a core button for interaction and a catalog icon for the visual cue. This keeps keyboard behavior, spacing and themes in the component system. The callback belongs to the surrounding application, so the example can open a dialog or navigate without assuming a router.",
    file: "src/components/SearchAction.tsx",
    code: `import { SearchIcon } from "@kamod-ch/icons/shadcn";
import { Button } from "@kamod-ch/ui";

export function SearchAction({ onSearch }: { onSearch: () => void }) {
  return (
    <Button variant="outline" onClick={onSearch}>
      <SearchIcon size={18} aria-hidden="true" />
      Search
    </Button>
  );
}`,
    result:
      "Compare the action beside its neighbors in light and dark themes. Keep the label when there is room; if a compact toolbar hides it, supply an accessible name on the button and retain the same action and focus behavior.",
  },
  "signals-package": {
    steps: [
      {
        title: "Give the saved value a clear owner",
        code: 'const theme = persistedSignal("theme", "dark", { storage: "local" });',
        note: "The key identifies browser storage, while the variable identifies the live signal. Decide whether it is a device preference or belongs to a signed-in account before sharing the key across screens or sessions.",
      },
      {
        title: "Read and write through one signal",
        code: 'theme.value = "light";',
        note: "Consumers should observe the same instance. Copying the value into unrelated local state creates a second owner that can become stale. Keep derived presentation derived, rather than synchronizing two writable values with effects.",
      },
      {
        title: "Provide an explicit reset",
        code: "theme.reset();",
        note: "Reset restores the initial value; clearing a stored entry is a separate operation. Use an explicit user action for preference resets, and verify the behavior after reload rather than only checking the currently rendered label.",
      },
    ],
    title: "Keep a preference local to a component",
    introduction:
      "A custom hook can keep the persistent preference close to the settings control. The versioned key below leaves room for a future storage-shape change. This example is intentionally a harmless preference, not authentication or private user data.",
    file: "src/components/DensityPreference.tsx",
    code: `import { usePersistedSignal } from "@kamod-ch/signals";
import { Button } from "@kamod-ch/ui";

export function DensityPreference() {
  const compact = usePersistedSignal("ui:compact:v1", false, { storage: "local" });
  return (
    <div class="flex flex-wrap gap-2">
      <Button aria-pressed={compact.value} onClick={() => { compact.value = !compact.value; }}>
        Compact spacing
      </Button>
      <Button variant="ghost" onClick={() => compact.reset()}>Restore default</Button>
    </div>
  );
}`,
    result:
      "Toggle, reload and restore the default. Then test without a stored value and with browser storage restricted. For SSR, ensure the first client render agrees with the server; browser-only preferences cannot automatically be known by the server.",
  },
  "state-package": {
    steps: [
      {
        title: "Name the event",
        code: 'const increment = createAction("counter/increment");',
        note: "A named event describes an intention, not a particular button. Multiple controls can dispatch it without teaching the reducer about their markup. Keep naming consistent as the feature grows.",
      },
      {
        title: "Return a new value only for a handled event",
        code: "increment.match(action) ? { count: state.count + 1 } : state",
        note: "The matcher selects the branch. Returning the existing state for unrelated actions protects the current value; returning a new object for the matching action makes the transition explicit. Avoid mutation or network work inside the reducer.",
      },
      {
        title: "Dispatch through the store boundary",
        code: "store.dispatch(increment());",
        note: "A dispatch changes the model. A Preact view also needs a subscription, normally through the package's context and selector hooks. Reading a snapshot once does not turn an arbitrary component into a subscriber.",
      },
    ],
    title: "Define the state and event contract together",
    introduction:
      "An explicit state type makes the model readable as soon as a second view needs it. A factory gives each test or server request its own store. Decide where the app owns that instance before wiring a provider around its consumers.",
    file: "src/state/counter.ts",
    code: `import { createAction, createStore } from "@kamod-ch/state";

export const increment = createAction("counter/increment");
type CounterState = { count: number };
type CounterAction = ReturnType<typeof increment>;

export function createCounterStore() {
  return createStore<CounterState, CounterAction>({
    reducer: (state = { count: 0 }, action) =>
      increment.match(action) ? { count: state.count + 1 } : state,
  });
}`,
    result:
      "Create two stores and confirm that dispatching to one does not change the other. When adding asynchronous work, represent pending, success and failure deliberately and keep the effect outside the reducer. Consult the package reference for context, selectors and middleware signatures.",
  },
} satisfies Record<keyof typeof packageGuideNotes, Recipe>;
