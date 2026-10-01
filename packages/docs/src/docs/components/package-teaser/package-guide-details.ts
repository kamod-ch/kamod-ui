import type { packageGuideNotes } from "./package-guide-notes";

type PackageDetails = {
  purpose: string;
  features: readonly [string, string, string];
  steps: readonly [string, string, string];
  outcome: string;
};

/** Reading notes explain the existing examples without introducing another API reference. */
export const packageGuideDetails = {
  "hooks-package": {
    purpose:
      "Reach for a hook when a component needs reusable behavior: a boolean state, a bounded counter or a browser preference. Keep the visual control in Kamod UI and the behavior in the hook.",
    features: [
      "Start with a single component and let it own the hook's lifetime. This keeps independent instances independent and makes mounting, resetting and cleanup easier to reason about.",
      "Choose an import convention your team can follow consistently. Check the production output before changing imports for bundle-size reasons; a smaller-looking import is not itself a measurement.",
      "Use a demo to explore the normal path, then try the boundary that matters to your screen: an empty value, a fast repeated action or an unmount while work is pending.",
    ],
    steps: [
      "Read the values and actions returned by each hook. Connect the value to visible content and use the action in the control's event handler.",
      "Try the toggle repeatedly and move the counter in both directions. Keep any limits or disabled states consistent with the behavior you intend.",
      "Render a second instance before extracting shared state. Confirm whether the two controls should behave independently or share one owner.",
    ],
    outcome:
      "A reusable interaction should preserve its behavior when the surrounding markup changes. Keep hook ownership stable while adjusting buttons, labels and layout.",
  },
  "i18n-package": {
    purpose:
      "Treat language as part of the application model. Start with complete messages, give every locale the same structure, and keep translation lookup separate from presentation and locale selection.",
    features: [
      "Group messages around a screen or task, such as common actions or checkout errors. Add a key to the default locale first, then supply the corresponding translations so changes remain easy to review together.",
      "Place the provider around the tree that shares a language. Translate the visible label and its accessible name together; switching languages should not leave controls with mixed-language instructions.",
      "Resolve the locale at the request boundary and reuse that choice during hydration. Test two requests with different languages to catch accidental shared state before deploying.",
    ],
    steps: [
      "The en object defines the message structure. Its common.save key is the shared contract for every translation of this example.",
      "The de object supplies the same key with German content. The satisfies check validates its shape while retaining the concrete values for TypeScript.",
      "The instance starts in English, so the final lookup returns Save. Add another complete message and its translation before connecting locale selection to your UI.",
    ],
    outcome:
      "A language switch is complete when visible text, accessible labels, formatting and document language agree. Leave room for longer translations instead of fixing controls to English label widths.",
  },
  "icons-package": {
    purpose:
      "Choose icons for meaning first and appearance second. Keep one coherent family within a toolbar, then let size, spacing and semantic color connect it to the surrounding interface.",
    features: [
      "Wrap interactive icons in real buttons or links. The SVG draws the symbol; the surrounding control supplies focus, keyboard behavior and a comfortable click target.",
      "Copy the exact exported name and family from the catalog. Keep related imports together so a filled symbol is not accidentally mixed into a group of outline controls.",
      "Inherit the control's text color for ordinary actions. Reserve emphasis for meaningful state, and pair error or success symbols with text rather than communicating through color alone.",
    ],
    steps: [
      "Read the family subpath in the import. Verify each chosen symbol in the catalog before replacing it with a similarly named icon.",
      "Keep the example's icons aligned with their surrounding text. Adjust the control's padding separately from the SVG dimensions.",
      "Decide whether each icon is decorative or meaningful. Hide decorative SVGs from assistive technology and name any control that has no visible text.",
    ],
    outcome:
      "Review the finished controls together, not as isolated SVGs. Compare optical size, baseline alignment and focus visibility in the actual toolbar or navigation group.",
  },
  "signals-package": {
    purpose:
      "Use persistence for values that should outlive their current render. Decide what the preference belongs to, how long it should survive and how a user can return to the default.",
    features: [
      "Give each preference a stable storage key and a useful initial value. Treat future changes to the stored shape as a migration decision, rather than assuming every returning visitor has fresh data.",
      "Share a signal only when its consumers should share the same value. Keep temporary screen state local, and avoid copying persisted values into a second independently writable store.",
      "Keep request-specific cookie handling at the server boundary. Verify that the server and client agree on the initial value, and check what happens when there is no saved preference.",
    ],
    steps: [
      "Identify the key and default value used to create the signal. Decide whether that key describes a device preference, a session value or account-specific information.",
      "Read and write through .value so the same signal remains the source of truth. Connect a real setting control to that value before adding more preferences.",
      "Change the preference and reload. Then test a fresh browser context and unavailable storage so the default path receives the same attention as the saved path.",
    ],
    outcome:
      "Persistence needs a reset policy as well as a save path. Decide which values remain after sign-out, which expire with the session and which should never be stored at all.",
  },
  "state-package": {
    purpose:
      "Use named actions and reducers when changes need a clear explanation. Model the events in your flow first, then decide which components read state and which dispatch actions.",
    features: [
      "Choose action names that describe a domain event. Keep the payload focused so a reducer can make its decision from the current state and that event without reaching into a component.",
      "Place the store boundary around the consumers that need it. Select the state each view actually uses and keep transient interaction details local when they do not belong in the domain model.",
      "Use a bridge when an existing signal-based view needs a store slice. Keep the store authoritative and derive the view instead of synchronizing two separately editable copies.",
    ],
    steps: [
      "The increment action names one event. Its matcher narrows the reducer branch that responds to that event.",
      "The reducer creates a new count for a matching action and returns the existing state for everything else. Keep unrelated actions from resetting the value.",
      "Dispatch the event, then test the reducer with both matching and unrelated actions. Add loading and failure transitions only when the actual flow needs them.",
    ],
    outcome:
      "A useful state model explains both what happened and what the user sees next. Pair loading, success and failure transitions with visible feedback and deliberate focus behavior.",
  },
} satisfies Record<keyof typeof packageGuideNotes, PackageDetails>;
