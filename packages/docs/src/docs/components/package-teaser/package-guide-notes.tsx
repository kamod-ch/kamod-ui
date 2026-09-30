import type { ComponentChildren } from "preact";

type PackageNotes = {
  introduction: ComponentChildren;
  integration: ComponentChildren;
  checks: string[];
};

/** Practical integration guidance supplements, rather than replaces, the package descriptions. */
export const packageGuideNotes = {
  "hooks-package": {
    introduction: (
      <>
        Start with <strong>one behavior your screen needs</strong>: a toggle, a counter or a browser
        preference. Keep the hook close to the component that owns it, then compose its state with
        your existing controls.
      </>
    ),
    integration: (
      <>
        <p>
          <strong>Separate behavior from presentation.</strong> A hook can own the value or
          lifecycle while a button, field or dialog supplies the interface. Keep labels, disabled
          states and keyboard behavior in the component rather than recreating them inside each
          consumer.
        </p>
        <p>
          Call hooks consistently at the top level of your component. Check each hook’s return types
          and cleanup behavior before combining it with an effect; avoid a second listener or
          subscription for work the hook already handles.
        </p>
        <p>
          For browser-backed behavior, review the first server render and the first client render
          separately. Test storage access, viewport changes and unmounting in the environment where
          the component will actually run.
        </p>
      </>
    ),
    checks: [
      "Exercise both sides of a toggle and the boundaries of counters.",
      "Unmount and remount the component; check that timers or listeners do not accumulate.",
      "Use semantic controls and expose state through visible labels and the appropriate ARIA attributes.",
    ],
  },
  "i18n-package": {
    introduction: (
      <>
        Build around <strong>one default locale and a clear message schema</strong>. Translate
        complete messages, keep formatting locale-aware, and plan how the selected language reaches
        both your server-rendered document and your Preact tree.
      </>
    ),
    integration: (
      <>
        <p>
          <strong>Organize messages by the task they describe.</strong> Group labels, hints and
          validation messages together so a form can be translated as a coherent experience. Keep
          user-facing strings out of rendering branches where they are easy to miss.
        </p>
        <p>
          Allow room for longer translations in buttons, navigation and empty states. Prefer
          complete messages over concatenated fragments, and use locale-aware formatting for dates
          and numbers instead of building display strings manually.
        </p>
        <p>
          Create request-specific instances on the server and pass the same starting locale to the
          client. When language changes, review document <code>lang</code>, translated accessible
          names and any region whose reading direction changes.
        </p>
      </>
    ),
    checks: [
      "Check a missing translation and confirm that the intended fallback is understandable.",
      "Try long labels, plural messages and locale-specific dates and numbers.",
      "Reload a translated route and verify that the first render and accessible labels use the selected language.",
    ],
  },
  "icons-package": {
    introduction: (
      <>
        Choose a consistent family for related actions and let <code>currentColor</code> connect the
        icons to your theme. Treat icons as <strong>part of a control’s meaning</strong>, with a
        readable label or an accessible name wherever an action would otherwise be ambiguous.
      </>
    ),
    integration: (
      <>
        <p>
          <strong>Use one visual language for each group of controls.</strong> Match optical size,
          stroke or fill treatment, and spacing across toolbars. The SVG can stay small while the
          surrounding button provides a comfortable target.
        </p>
        <p>
          Keep set imports explicit and verify the exported component name before copying an
          example. Use the catalog’s import snippet as your starting point; similarly named symbols
          from different icon sets are not necessarily interchangeable.
        </p>
        <p>
          Let the surrounding control own the interaction. Use <code>aria-hidden</code> for
          decorative SVGs and put an <code>aria-label</code> on an icon-only button. Check the icon
          and its focus indicator against both light and dark surfaces.
        </p>
      </>
    ),
    checks: [
      "Check that every icon-only action has a meaningful accessible name.",
      "Compare size and alignment with nearby text and icons in the same family.",
      "Review hover, focus and disabled states without relying on color alone.",
    ],
  },
  "signals-package": {
    introduction: (
      <>
        Decide <strong>which values should survive a reload</strong> before choosing a storage
        driver. Use a stable key, define a useful initial value, and keep the lifetime of the signal
        aligned with the screen, session or application that owns it.
      </>
    ),
    integration: (
      <>
        <p>
          <strong>Persist preferences deliberately.</strong> A color scheme or density setting has a
          different lifetime from a draft or an account-specific value. Name keys clearly, decide
          when they should be reset and avoid retaining temporary UI state without a reason.
        </p>
        <p>
          The module-level usage example demonstrates a shared signal. In a server-rendered
          application, do not share user-specific mutable state across requests. Follow the
          package’s SSR and cookie guidance when a preference must be available before hydration.
        </p>
        <p>
          Keep reads and writes through the signal’s <code>.value</code> interface and review how
          your chosen driver handles unavailable storage. Plan for old stored values when you change
          a preference’s shape or allowed options.
        </p>
      </>
    ),
    checks: [
      "Try a fresh visit, a saved preference and an explicit reset.",
      "Test your chosen driver with unavailable storage and unexpected stored values.",
      "Verify that account or request-specific data cannot leak through shared module state.",
    ],
  },
  "state-package": {
    introduction: (
      <>
        Model <strong>meaningful state transitions</strong> with named actions and a focused
        reducer. Keep one clear source of truth, then connect only the state each component needs
        through your chosen Preact integration.
      </>
    ),
    integration: (
      <>
        <p>
          <strong>Name actions for what happened.</strong> Keep reducer transitions predictable and
          place network requests or other effects at a deliberate application boundary. This makes
          loading, success and failure states easier to inspect and test.
        </p>
        <p>
          Choose the store’s lifetime explicitly: an isolated flow, a mounted application tree or a
          request. Avoid a shared server singleton for user-specific state. Use selectors to keep
          the relationship between component inputs and domain state easy to follow.
        </p>
        <p>
          If you also use signals, define which layer owns the value before adding a bridge. Derive
          a view of existing state rather than maintaining two independently writable copies that
          can drift apart.
        </p>
      </>
    ),
    checks: [
      "Test successful, failed and cancelled transitions with representative actions.",
      "Confirm that unrelated actions leave the reducer’s state intact.",
      "Check that opening and closing UI through actions also preserves focus and keyboard behavior.",
    ],
  },
} satisfies Record<string, PackageNotes>;
