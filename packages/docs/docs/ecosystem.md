---
title: The Kamod Ecosystem
description: A practical map of Kamod components, blocks, themes and companion projects, with package selection, working code, integration checks and source repositories.
pageKind: ecosystem-guide
sidebar: false
outline: false
---

## Choose a Starting Point

Start with **Something a Person Can Do**: change a preference, submit a form, find a record or compare a result. Choose the tools that make that task work. The ecosystem gives you several levels of composition, from a single button to a complete application layout, without asking every project to adopt the same structure.

**UI Components** render controls and manage their interactions. **Blocks** arrange those controls into useful layouts. **Themes** give both the same colors, spacing and focus language. **Companion Packages** add specific behavior or data handling. Your application still owns routes, services, records and permissions.

| Your next task                             | Start with                                                                           | Add when needed                                                                    |
| ------------------------------------------ | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Build the first styled screen              | [Getting Started](/docs/getting-started) and [UI Components](/docs/components)       | [Themes](/docs/theming/installation) and [Icons](/docs/icons-package/installation) |
| Give a workspace its navigation and layout | [Application Shells](/blocks/application-shell) or [Sidebar Blocks](/blocks/sidebar) | Your router, real destinations and account actions                                 |
| Collect and save information               | [Forms](/docs/forms) and the relevant [Fields](/docs/field/installation)             | Validation, a submit service and useful recovery messages                          |
| Reuse a small interaction                  | [Hooks](/docs/hooks-package/installation)                                            | A component that exposes the current value and its actions                         |
| Remember a harmless preference             | [Signals](/docs/signals-package/installation)                                        | A storage driver, a stable key and validation for saved data                       |
| Coordinate several screens                 | [State](/docs/state-package/installation)                                            | Explicit actions, transitions and request ownership                                |
| Support several languages                  | [i18n](/docs/i18n-package/installation)                                              | Translated messages and locale-aware formatting                                    |

For a new integration, follow the [Getting Started Guide](/docs/getting-started#set-up-your-app). For an existing application, begin at the responsibility you are changing. A working feature is a better reason to add a dependency than the fact that another package is available.

## Build the Interface Foundation

These projects define how the interface is put together and how it feels. Use the same styling foundation throughout the app so a copied block, a form control and a documentation panel can share the same theme. Check a component's supported API before adapting an example.

| Project                                                                              | Role                  | Good fit                                                                                                                                                                                                                                                 | Guide                                                                             | Source                                                                    |
| ------------------------------------------------------------------------------------ | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [@kamod-ch/ui](https://github.com/kamod-ch/kamod-ui)                                 | Individual controls   | Compose **buttons, fields, menus and overlays** from focused components. Start with their supported props and keyboard behavior, then supply the labels and content your feature needs. Each control follows the same semantic theme.                    | [Components](/docs/components)                                                    | [Source](https://github.com/kamod-ch/kamod-ui/tree/main/packages/core)    |
| [@kamod-ch/blocks](https://github.com/kamod-ch/kamod-ui/tree/main/packages/blocks)   | Complete compositions | Give a workspace its **shell, sidebar or authentication layout**. Bring the supporting files with the block and connect your own routes, account actions and data. The source stays in your project, ready to adapt.                                     | [Blocks](/blocks)                                                                 | [Source](https://github.com/kamod-ch/kamod-ui/tree/main/packages/blocks)  |
| [@kamod-ch/themes](https://github.com/kamod-ch/kamod-ui/tree/main/packages/themes)   | Shared visual tokens  | Keep **surfaces, text, accents and focus rings** consistent. Choose a preset or adjust semantic tokens so light and dark modes remain part of one interface. Change a role once and let the components follow.                                           | [Theming](/docs/theming/installation)                                             | [Source](https://github.com/kamod-ch/kamod-ui/tree/main/packages/themes)  |
| [@kamod-ch/typeset](https://github.com/kamod-ch/kamod-ui/tree/main/packages/typeset) | Reading and content   | Style **articles, rich text and Markdown** through CSS typography. Use a content wrapper when the hierarchy belongs to prose, while keeping interactive controls under their component styles. Reading presets and opt-outs keep that boundary explicit. | [Typeset](https://github.com/kamod-ch/kamod-ui/tree/main/packages/typeset#readme) | [Source](https://github.com/kamod-ch/kamod-ui/tree/main/packages/typeset) |

### Keep Styles at the Application Boundary

Load the global stylesheet from the app's entry point. Keep **Tailwind Source Detection** aware of the components and blocks you actually use. If a control behaves correctly but looks unstyled, check the stylesheet and generated utilities before changing its implementation. The [CSS Setup Guide](/docs/theming/css-setup) explains that boundary in detail.

Use `--background`, `--foreground`, `--muted` and related semantic tokens to express a surface's purpose. The [Theme Reference](/docs/theming/installation) shows how those values change together. Test the same control in both color modes, including focus, disabled, selected and error states.

## Add Focused Capabilities

These companion projects solve problems around the controls. Each has a guide here and its own source repository. Start with the small example, inspect the returned values or supported exports, then connect it to the feature you already have.

| Project                                                        | Role                         | Good fit                                                                                                                                                                            | Guide                                         | Source                                              |
| -------------------------------------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | --------------------------------------------------- |
| [@kamod-ch/icons](https://github.com/kamod-ch/kamod-icons)     | A consistent visual language | Give actions recognizable SVG shapes. Choose one icon family for related controls, import named icons and let them inherit the control's color.                                     | [Icons](/docs/icons-package/installation)     | [Source](https://github.com/kamod-ch/kamod-icons)   |
| [@kamod-ch/hooks](https://github.com/kamod-ch/kamod-hooks)     | Local reusable behavior      | Reuse state, lifecycle, browser and async patterns close to the component that owns them. A hook supplies behavior; the visible control still needs a label and predictable states. | [Hooks](/docs/hooks-package/installation)     | [Source](https://github.com/kamod-ch/kamod-hooks)   |
| [@kamod-ch/signals](https://github.com/kamod-ch/kamod-signals) | Reactive persistence         | Keep small preferences across reloads with a chosen storage driver. Decide who owns the value, how it is validated and when the saved value should replace the initial default.     | [Signals](/docs/signals-package/installation) | [Source](https://github.com/kamod-ch/kamod-signals) |
| [@kamod-ch/state](https://github.com/kamod-ch/kamod-state)     | Explicit shared transitions  | Model related changes with typed actions and reducers. Use it when several consumers need one understandable state model rather than separate copies of the same value.             | [State](/docs/state-package/installation)     | [Source](https://github.com/kamod-ch/kamod-state)   |
| [@kamod-ch/i18n](https://github.com/kamod-ch/kamod-i18n)       | Messages and formatting      | Connect translated messages and locale-aware values. Keep the default language as a useful reference, then test longer translations in the same layouts and controls.               | [i18n](/docs/i18n-package/installation)       | [Source](https://github.com/kamod-ch/kamod-i18n)    |

### Give Every Value One Owner

Local state works well for a control that changes independently. A shared model belongs above the consumers that need it. Persistence belongs to values that should survive a visit, such as a compact layout preference. **Sharing, Saving and Reacting Are Different Decisions**; they do not require the same solution in every feature.

The [Package Selection Guide](/docs/packages#package-boundaries) compares these boundaries. If hooks, signals and state appear together, keep one source of truth. A screen should not maintain a second writable copy simply to display a value another part of the app already owns.

## Explore the Wider Toolkit

Some projects become useful as the application grows beyond its first controls. Treat each as a deliberate integration: inspect its README, supported exports and installed version before adapting source. The links below distinguish the project's own reference from the UI guides on this site.

| Project                                                                               | Role                      | Good fit                                                                                                                                                                                                     | Guide                                                                           | Source                                                                   |
| ------------------------------------------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [@kamod-ch/motion](https://github.com/kamod-ch/kamod-motion)                          | Animation primitives      | Add purposeful transitions and feedback to Preact interfaces. Use movement to explain a change, respect reduced motion and keep animation away from unrelated page work.                                     | [README](https://github.com/kamod-ch/kamod-motion#readme)                       | [Source](https://github.com/kamod-ch/kamod-motion)                       |
| [@kamod-ch/ui-motion](https://github.com/kamod-ch/kamod-ui/tree/main/packages/motion) | Animated UI variants      | Explore motion alongside familiar Kamod component contracts. Compare the animated variant with its base component and keep keyboard behavior and accessible names intact.                                    | [README](https://github.com/kamod-ch/kamod-ui/tree/main/packages/motion#readme) | [Source](https://github.com/kamod-ch/kamod-ui/tree/main/packages/motion) |
| [@kamod-ch/charts](https://github.com/kamod-ch/kamod-charts)                          | SVG data visualization    | Explore charts for trends and comparisons. Check release availability and supported APIs, then provide meaningful labels and a text or table summary alongside the visual result.                            | [README](https://github.com/kamod-ch/kamod-charts#readme)                       | [Source](https://github.com/kamod-ch/kamod-charts)                       |
| [@kamod-ch/preactpress](https://github.com/kamod-ch/preactpress)                      | Documentation sites       | Publish Preact-oriented documentation with Markdown, code examples and static output. Use it when the project needs a maintained reference site, as this documentation does.                                 | [Docs](https://kamod-ch.github.io/preactpress/)                                 | [Source](https://github.com/kamod-ch/preactpress)                        |
| [@kamod-ch/openui](https://github.com/kamod-ch/kamod-ui/tree/main/packages/openui)    | Generative UI integration | Explore a defined component library for generated interfaces. Keep allowed components, data validation and application actions explicit rather than treating generated content as trusted application logic. | [README](https://github.com/kamod-ch/kamod-ui/tree/main/packages/openui#readme) | [Source](https://github.com/kamod-ch/kamod-ui/tree/main/packages/openui) |

**A Repository Is a Reference, Not a Promise That Every Example Matches Your Installation.** Read its release notes and package exports together. Avoid copying an import from an unreleased branch into a project that cannot resolve it. The [Integration Checks](#check-the-integration) below give you a small verification sequence.

## Build One Small Feature

Try a **Details Toggle** before connecting a larger workspace. It combines one behavior from `@kamod-ch/hooks`, one control from `@kamod-ch/ui` and a named SVG from `@kamod-ch/icons`. The visible panel explains the current state; the button's accessible attributes keep the relationship explicit.

In an existing styled Preact app, add the two optional companion packages:

```bash package-manager
pnpm add @kamod-ch/hooks @kamod-ch/icons
```

Use a separate file for the feature so its ownership is easy to see:

```tsx src/components/DetailsToggle.tsx
import { useToggle } from "@kamod-ch/hooks";
import { InfoIcon } from "@kamod-ch/icons/lucide";
import { Button } from "@kamod-ch/ui/button";
import { useId } from "preact/hooks";

export function DetailsToggle() {
  const [open, { toggle }] = useToggle(false);
  const panelId = useId();

  return (
    <section class="space-y-3" aria-label="Workspace details">
      <Button type="button" onClick={toggle} aria-expanded={open} aria-controls={panelId}>
        <InfoIcon size={16} aria-hidden="true" />
        {open ? "Hide details" : "Show details"}
      </Button>
      <div id={panelId} hidden={!open}>
        <p class="text-muted-foreground">
          Your workspace keeps related tools and content together.
        </p>
      </div>
    </section>
  );
}
```

### Read the Three Responsibilities

The hook owns the boolean and its `toggle` action. The button owns activation and visible feedback. The application owns the panel's content and where the feature appears. `useId` keeps the panel relationship distinct if you render the feature more than once.

Try it with **Enter and Space**, check both themes, and confirm the text explains the result. Then decide what the next requirement actually is. A saved compact-layout preference may call for [Persisted Signals](/docs/signals-package/installation#usage). A multi-step account workflow may call for [State](/docs/state-package/installation#usage). Translated button labels belong in [i18n](/docs/i18n-package/installation#usage).

For the exact contracts, follow [Button Props](/docs/button/installation#api-reference), [Hooks Usage](/docs/hooks-package/installation#usage) and [Icon Integration](/docs/icons-package/installation#usage). Keep those references close while replacing this example's content with your own feature.

## Connect the Feature to Your App

Keep the **Interface, Application State and Services** easy to distinguish. Components render a useful state and accept user actions. Your application decides what those actions mean. Services load or save records and verify access. A block can arrange all three without choosing your router or backend for you.

### A Workspace or Dashboard

Start with an [Application Shell](/blocks/application-shell), connect real destinations and supply the current path. Add [Icons](/docs/icons-package/installation) to recognizable actions and [Hooks](/docs/hooks-package/installation) where behavior repeats. Keep account permissions and data loading at the application boundary. A hidden navigation item does not replace a service's authorization check.

### A Settings or Account Form

Use the [Form Guides](/docs/forms) for fields, labels, validation and submission. Let the route own a durable draft if layout changes can unmount the form. Add [i18n](/docs/i18n-package/installation) when labels and feedback need translation; reserve [Signals](/docs/signals-package/installation) for preferences whose storage policy you have chosen. Sensitive records belong in the service, not automatically in browser storage.

### A Content or Reference Site

Use [Typeset](https://github.com/kamod-ch/kamod-ui/tree/main/packages/typeset#readme) for a readable article hierarchy and [PreactPress](https://kamod-ch.github.io/preactpress/) for the documentation pipeline. Keep live examples near the explanation they support. Load a large demo when readers open it rather than importing the entire catalog into every page.

Across these flows, handle **Loading, Empty, Failed and Successful Results** with useful messages. A good pending state explains what is happening without replacing content that can remain usable. A good error tells the person what they can do next.

## Check the Integration

Verify one complete journey before adding more packages. This catches a missing stylesheet, a mismatched import or a misplaced state owner while the feature is still small enough to understand.

| Check        | What to try                                                             | A useful result                                                                                              |
| ------------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Installation | Read the app's `package.json`, resolved versions and peer requirements. | The workspace that imports the package declares it, and the build resolves its public exports.               |
| Styling      | Open the feature in both themes and at a narrow width.                  | Text remains readable, controls fit and selected or focused states remain recognizable.                      |
| Keyboard     | Reach the control, activate it and close any overlay it opens.          | Focus is visible, actions have names and focus returns to a sensible control.                                |
| Ownership    | Change a value, navigate or alter the surrounding layout.               | State survives where expected, resets where intended and has one writable owner.                             |
| Persistence  | Reload with fresh, saved and invalid storage data.                      | Defaults and validation produce a usable screen; server and browser output agree during hydration.           |
| Performance  | Build for production and inspect a realistic interaction.               | Unused demos stay out of the route, repeated listeners are avoided and reading controls respond immediately. |
| Upgrades     | Compare the installed release with the example and changelog.           | Imports and contracts match the release you use; copied local changes are reviewed before replacement.       |

For deeper checks, continue with [Package Integration](/docs/packages#package-integration), [Persistence and Lifecycle](/docs/packages#package-lifecycle) or the [Whole Journey Review](/docs/getting-started#verify-the-whole-journey). Measure a representative screen before adding caching, memoization or a new state layer.

## Find the Source and Keep Going

The ecosystem spans **One UI Workspace and Several Focused Repositories**. UI components, blocks, themes, Typeset, UI Motion and OpenUI live in the [Kamod UI Repository](https://github.com/kamod-ch/kamod-ui). The companion projects link to their own repositories in the cards above. Use the repository that owns the behavior when looking for a declaration, changelog or issue.

Before reporting a problem, include the package version, import path, a small reproduction and what you expected to happen. For a visual issue, include the theme and available width. For a state issue, include the action sequence and whether a reload changes the result. That context makes an issue useful without requiring someone else to reconstruct your whole application.

| Repository                                                              | Explore                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Browse Kamod on GitHub](https://github.com/orgs/kamod-ch/repositories) | **Follow a working example back to its source.** Read the [UI README](https://github.com/kamod-ch/kamod-ui#readme), explore [`packages/core/src`](https://github.com/kamod-ch/kamod-ui/tree/main/packages/core/src), and compare [release notes](https://github.com/kamod-ch/kamod-ui/releases) before bringing an update into your app. Keep the example open as you browse: **seeing the code beside its behavior** helps you understand a pattern, choose what to reuse and adapt it with confidence. |
