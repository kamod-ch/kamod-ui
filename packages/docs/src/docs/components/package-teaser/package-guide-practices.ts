import type { packageGuideNotes } from "./package-guide-notes";

type Practice = {
  choices: readonly { need: string; approach: string; boundary: string }[];
  ownership: string;
  environment: string;
  failures: readonly { symptom: string; check: string }[];
  related: { label: string; href: string; reason: string };
  attribution?: { text: string; label: string; href: string };
};

/** Package-specific decisions and failure cases keep the shared layout useful beyond installation. */
export const packageGuidePractices = {
  "hooks-package": {
    choices: [
      {
        need: "One component's interaction",
        approach: "Start with useToggle or useCounter and let the component own the state.",
        boundary: "Avoid a shared store just to open one panel or change one quantity.",
      },
      {
        need: "A browser preference",
        approach: "Use useLocalStorageState when a value should survive reloads.",
        boundary:
          "Validate stored data and choose a safe default; persistence is not input validation.",
      },
      {
        need: "Browser or asynchronous behavior",
        approach: "Pick the dedicated hook after reviewing its lifecycle and options.",
        boundary:
          "Check cleanup and stale results when the component unmounts or its inputs change.",
      },
    ],
    ownership:
      "Start with the smallest owner that needs the behavior. Move a hook into a custom hook when several components need the same logic, not simply because a file is long. Sharing the function does not share its state: separate calls still represent separate instances. Lift ownership only when the product requires synchronized values.",
    environment:
      "Browser hooks and server rendering have different timing. Keep direct access to window, document and storage out of server render paths. Prefer a stable initial render and apply browser-only information after mount. For asynchronous interactions, decide what the user sees while a request is pending and when a later request replaces it.",
    failures: [
      {
        symptom: "The value resets unexpectedly",
        check:
          "Check whether a changing key or a conditional parent unmounts the component. Local state belongs to that mounted instance; moving the visual control can change its lifetime.",
      },
      {
        symptom: "The saved preference has an unexpected type",
        check:
          "Inspect old storage values and your serializer. TypeScript describes current code, not historical browser data. Test fresh storage and an older value before deciding on a migration.",
      },
      {
        symptom: "An interaction repeats or finishes late",
        check:
          "Look for listeners, timers or requests created outside the hook's lifecycle. Verify cleanup when navigating away and rapid repeated input; do not hide the issue by suppressing all errors.",
      },
    ],
    related: {
      label: "Persisted signals",
      href: "/docs/signals-package/installation",
      reason:
        "Compare persistent, shared reactive values with component-owned hook state before choosing a second state owner.",
    },
    attribution: {
      text: "Kamod Hooks is inspired by ahooks and adapts those patterns for Preact. Consult the package's LICENSE and NOTICE when redistributing source; compatibility and behavior should be checked against Kamod's own documentation.",
      label: "ahooks by Alibaba",
      href: "https://github.com/alibaba/hooks",
    },
  },
  "i18n-package": {
    choices: [
      {
        need: "A visible message",
        approach: "Define a complete sentence under a stable semantic key.",
        boundary: "Avoid stitching translated fragments together; grammar and word order differ.",
      },
      {
        need: "Dates, numbers and currencies",
        approach:
          "Format data with the intended locale using Intl or the documented formatting API.",
        boundary:
          "Keep machine values separate from display strings; a translated number is not a storage format.",
      },
      {
        need: "A localized Preact tree",
        approach: "Use I18nProvider and useI18n from the Preact entry point.",
        boundary:
          "Resolve the initial locale once and keep server output and hydration consistent.",
      },
    ],
    ownership:
      "Choose one locale owner for the relevant application tree. A language menu, route parameter and saved preference can all contribute to that choice, but they should not compete as independent writable sources. Define their precedence explicitly. Keep a user's language preference separate from assumptions about currency, country or time zone.",
    environment:
      "For server-rendered pages, create request-specific translation state and carry the resolved locale into the client. Test simultaneous requests in different languages. Use the correct document lang and, when applicable, dir; those attributes affect pronunciation and layout beyond the strings returned by the translator.",
    failures: [
      {
        symptom: "Some labels stay in the old language",
        check:
          "Check whether they were translated once outside a reactive consumer. Also inspect accessible names, validation messages and loading text; visible headings alone are not the entire interface.",
      },
      {
        symptom: "The layout breaks in another locale",
        check:
          "Try longer translations, narrow widths and larger text. Allow buttons and navigation labels to wrap where appropriate; truncating an essential action can conceal its meaning.",
      },
      {
        symptom: "The server shows another visitor's language",
        check:
          "Look for a mutable module-level instance shared across requests. Move locale resolution and instance creation to the request boundary and add a two-locale isolation test.",
      },
    ],
    related: {
      label: "Forms and validation",
      href: "/docs/formisch/installation",
      reason:
        "Include validation errors, field instructions and submit feedback in your message schema, not only navigation labels.",
    },
  },
  "icons-package": {
    choices: [
      {
        need: "A labeled action",
        approach: "Pair a decorative SVG with a visible label inside a core control.",
        boundary: "The icon reinforces the text; it should not duplicate the accessible name.",
      },
      {
        need: "An icon-only action",
        approach: "Give the surrounding button a precise aria-label and visible focus treatment.",
        boundary: "Use a familiar symbol, but do not rely on familiarity as its only explanation.",
      },
      {
        need: "A status or category",
        approach: "Pair the symbol with text and use semantic theme colors.",
        boundary:
          "Neither color nor shape alone should be the only way to understand a critical status.",
      },
    ],
    ownership:
      "Keep icon choices close to the controls that use them, or put a small domain-specific mapping in one module when the same statuses repeat. Avoid importing every icon into a runtime name lookup for a few known actions. Explicit imports make it easier to audit family choices and understand which symbols the page needs.",
    environment:
      "Review the complete control under light and dark themes, browser zoom and keyboard focus. currentColor should normally follow the surrounding semantic text color. Size, stroke weight and internal SVG padding all affect perceived weight, so compare related icons at their actual rendered size rather than matching dimensions alone.",
    failures: [
      {
        symptom: "An import does not resolve",
        check:
          "Confirm the exact family subpath and exported name against the installed version. A similarly named icon in another library is not evidence that this package exports it.",
      },
      {
        symptom: "The symbol looks faint or misaligned",
        check:
          "Inspect inherited color, flex shrinking and the line height of adjacent text. Keep the SVG from shrinking in a crowded control and adjust surrounding layout before editing its paths.",
      },
      {
        symptom: "A screen reader announces an action twice",
        check:
          "Keep the SVG decorative when the parent already has a visible label or aria-label. Test the control's accessible name rather than assuming an SVG title improves every use case.",
      },
    ],
    related: {
      label: "Component styles",
      href: "/blocks/styles",
      reason:
        "Apply a coherent hierarchy of icon sizes, button variants and surface treatments across complete layouts.",
    },
  },
  "signals-package": {
    choices: [
      {
        need: "A preference across visits",
        approach: "Choose local storage for small, non-sensitive browser preferences.",
        boundary:
          "A saved browser value is neither account synchronization nor authoritative server data.",
      },
      {
        need: "A shorter-lived browser value",
        approach: "Choose session storage when the lifetime should follow that browser session.",
        boundary: "Document which values survive refreshes and which should disappear on sign-out.",
      },
      {
        need: "Server-aware persistence",
        approach: "Review the cookie driver and createCookieContext at the request boundary.",
        boundary:
          "Cookie scope, response headers and request isolation belong to the server integration.",
      },
    ],
    ownership:
      "Name keys by purpose and treat a stored shape as a small data contract. Give defaults the same care as saved values. Decide whether clearing a preference means removing storage, resetting the live value, or both. For account-specific settings, define sign-out behavior and avoid silently applying one user's saved value to the next user on the device.",
    environment:
      "Storage availability, hydration and cross-tab updates are separate concerns. Test the chosen driver in the actual environment instead of assuming all storage behaves like synchronous local storage. If a preference changes layout, make the initial server and client output compatible and avoid a second competing copy of the value in component state.",
    failures: [
      {
        symptom: "A value changes back after refresh",
        check:
          "Check the storage driver, key and write path. Make sure the code updates .value on the intended persisted signal rather than a separate temporary variable.",
      },
      {
        symptom: "A returning visitor sees invalid data",
        check:
          "Inspect the saved shape from older releases. Validate or migrate before using it, and provide a reset path when the value cannot be recovered.",
      },
      {
        symptom: "Two controls disagree",
        check:
          "Confirm that they are meant to share a source and review the driver's synchronization behavior. Matching variable names do not guarantee matching signal instances or storage keys.",
      },
    ],
    related: {
      label: "Reducer state",
      href: "/docs/state-package/installation",
      reason:
        "Use explicit events and transitions when a workflow needs more structure than a persisted preference.",
    },
  },
  "state-package": {
    choices: [
      {
        need: "A local open or closed control",
        approach: "Keep simple presentation state local to the component.",
        boundary:
          "A reducer store is useful when events and shared ownership add clarity, not for every boolean.",
      },
      {
        need: "A shared domain workflow",
        approach: "Model named actions and derive the next state in a pure reducer.",
        boundary:
          "Store domain facts; derive display labels and totals where possible instead of saving duplicates.",
      },
      {
        need: "A reactive view of store data",
        approach: "Select the smallest useful value with the package's Preact integration.",
        boundary:
          "If a signals bridge is needed, keep one authoritative writer rather than two synchronized stores.",
      },
    ],
    ownership:
      "Put the store at the boundary of the workflow it represents. A page-local flow can use a page-local owner, while an app-wide session model may need a longer lifetime. For SSR and tests, factories make ownership explicit. Keep reducers deterministic so the same state and event produce the same result without depending on the clock or network.",
    environment:
      "Model asynchronous outcomes as deliberate transitions. A submit action can lead to pending, followed by success or failure; the component then renders those states. Keep the request itself outside the reducer and decide how stale results are handled if the user starts another operation or leaves the screen before it completes.",
    failures: [
      {
        symptom: "Dispatch happens but the view does not update",
        check:
          "Verify that the view subscribes through the appropriate context or selector API. Also check that the matching reducer branch returns a new value instead of mutating existing state.",
      },
      {
        symptom: "An unrelated action resets the screen",
        check:
          "Inspect the reducer's fallback branch. Return the current state for actions it does not handle rather than recreating the initial state.",
      },
      {
        symptom: "State leaks between tests or requests",
        check:
          "Look for a shared module-level store. Create an instance for each independent owner and verify that updates in one instance cannot affect the other.",
      },
    ],
    related: {
      label: "Component-owned hooks",
      href: "/docs/hooks-package/installation",
      reason:
        "Keep transient UI behavior close to its component while the store owns the shared domain model.",
    },
  },
} satisfies Record<keyof typeof packageGuideNotes, Practice>;

export type { Practice as PackagePractice };
