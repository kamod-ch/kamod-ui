---
title: Getting Started with Kamod UI
description: A complete path through setup, components, blocks, forms and the Kamod ecosystem, with working examples and detailed reference links.
pageKind: getting-started-guide
sidebar: false
outline: false
---

## Choose Your Starting Point

Kamod UI is a **Preact-Native Component System** built with `TypeScript` and `Tailwind CSS`. It gives you reusable interface controls, complete layout examples and a shared styling foundation. Your application supplies the routes, records, permissions and services that turn those pieces into a product.

This guide follows one practical sequence: **Establish the Stylesheet, Build a Small Screen, Compose a Feature, Then Connect Real Behavior**. Read it from the beginning for a new integration. For an existing app, jump to the responsibility you are working on and follow the linked references for its complete API.

Keep one small feature in mind as you read: **A Workspace Settings Screen**. First render a preference, then understand its component contract, put it inside a useful layout and connect a save operation. The same choices about ownership, labels and styling carry forward into every later chapter. You can apply that sequence to another product task without adopting an entire example application.

Each chapter adds one responsibility to that baseline. The final [Delivery Review](#ship-a-complete-feature) brings them together, and [Your Next Steps](#find-your-next-reference) turns the result into a practical plan for the next feature.

### Find the Right Level of Composition

| You want to…                                              | Start here                                            | Continue with                                         |
| --------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------- |
| Render the first styled control                           | [Set Up Your App](#set-up-your-app)                   | [CSS Setup](/docs/theming/css-setup)                  |
| Choose an input, action or overlay                        | [Components](#components)                             | [Component Library](/docs/components#library-items)   |
| Add a sidebar, application shell or authentication layout | [Blocks](#blocks)                                     | [Block Collections](/blocks#library-items)            |
| Collect and validate information                          | [Forms](#forms)                                       | [Form Design](/docs/forms#design-forms)               |
| Add icons, reusable behavior or shared state              | [Packages](#packages)                                 | [Package Directory](/docs/packages#library-items)     |
| Change appearance without rewriting behavior              | [Style Your Interface](#style-your-interface)         | [Theming & Styles](/docs/theming/installation)        |
| Diagnose an integration that almost works                 | [Verify the Whole Journey](#verify-the-whole-journey) | [Troubleshooting](#diagnose-the-boundary-that-failed) |

**Components** are the individual pieces: a `Button`, `Input`, `Dialog` or `Sidebar`. **Blocks** are larger compositions of those pieces, including their supporting files. **Forms** explain how controls work together with labels, validation and submission. **Packages** add focused capabilities beyond the UI itself. These are complementary starting points, not competing installation modes.

### Keep the Documentation and Your App Connected

Each component page brings together installation, usage, examples and its API reference. Try the **Interactive Preview** before copying source: use the keyboard, inspect compact widths and compare light and dark themes. The **Code** view explains the implementation; the **Prompt** view provides context you can carry into your own development workflow.

When a block has several files, inspect its **Source Tree** as well as the entry component. A visible preview can depend on local navigation data, assets and small helpers. Copying just the longest file leaves those dependencies behind. The [Block Setup Guide](/blocks/getting-started#bring-the-complete-source-into-your-app) explains how to bring the composition across intact.

_Examples are starting points for your application._ A demo route, sample user or simulated save is not a connected backend. Read the surrounding explanation to identify which behavior the example implements and which boundary your app must supply.

## Set Up Your App

Begin inside a working `Preact` application. Keep its existing build tool, router and rendering entry. Kamod does not require a particular routing framework, and adding it should not require replacing your application's structure. For a new project, generate the Preact app using your chosen framework's supported setup first, then follow this integration.

### Check the Application Boundary

Locate three files: **The Package Manifest**, **The Application Entry** and **The Global Stylesheet**. The manifest declares dependencies. The entry mounts or hydrates your interface. The stylesheet supplies generated utilities and shared tokens. Keeping those responsibilities explicit makes a missing style much easier to distinguish from a failed import.

In a workspace, install dependencies in the application that imports them. A package available from the repository root may still be absent from the application's declared dependencies. Preserve the project's package manager and lockfile, and check the installed version before using an export shown on a newer documentation page.

Keep `preact`, `@kamod-ch/ui` and directly imported companion packages in the consuming app's **Runtime Dependencies**. Tailwind and its bundler integration belong to the **Build Pipeline**. Check for duplicate runtime versions before adding compatibility aliases; Kamod's native components do not need React or React DOM to render.

For a pnpm workspace, these commands help inspect the resolved installation before changing it:

```bash
pnpm list @kamod-ch/ui @kamod-ch/themes preact @preact/signals
pnpm why preact
```

Record which workspace owns the stylesheet and which command builds it. An editor resolving an import, a browser loading a script and a production build finding the same dependency are **Three Separate Checks**.

Continue with [Versions & Peers](/docs/packages#package-installation) for dependency checks and [Public Imports](/docs/packages#package-imports) for package boundaries.

### Install the UI and Theme Foundation

For an existing Preact app, install the UI, full theme foundation and Preact Signals peer dependency. The tabs below provide equivalent commands for the common package managers:

```bash package-manager
pnpm add @kamod-ch/ui @kamod-ch/themes @preact/signals
```

`@kamod-ch/ui` supplies components. `@kamod-ch/themes` supplies the full token and preset foundation used throughout these guides. `@preact/signals` belongs to Preact; it is distinct from the optional `@kamod-ch/signals` persistence package described [Later in This Guide](#signals). Ensure `preact` is already installed and compatible with the packages' peer requirements.

Add `@kamod-ch/icons` when your interface or a copied example imports icons. Other dependencies belong to the feature that needs them: a schema form may require `valibot` and `@formisch/preact`, while a plain input does not.

#### Connect Tailwind to Your Build Tool

Kamod uses `Tailwind CSS v4`. Enable the integration supported by your bundler. In an existing Vite app, the build dependencies are:

```bash
pnpm add -D tailwindcss @tailwindcss/vite
```

Add `tailwindcss()` from `@tailwindcss/vite` to the existing Vite plugins alongside your Preact plugin. Preserve existing aliases, framework plugins and build settings. For other build tools, use their Tailwind integration rather than copying a Vite configuration into a different pipeline.

### Load the Global Stylesheet

Import Tailwind first, then the full Kamod theme. Make the installed component classes discoverable to Tailwind. This example assumes `app.css` is directly inside `src/` and that the installed UI package resolves beneath the application's `node_modules` directory:

```css src/app.css
@import "tailwindcss";
@import "@kamod-ch/themes/theme.css";

@source "../node_modules/@kamod-ch/ui/dist/**/*.{js,mjs}";
```

The `@source` path is **Relative to This Stylesheet**. Adjust it for your actual folder layout and installed package output. Shared workspace source or copied files outside the app's scanned paths may need their own discovery entry. The [Source Detection Guide](/docs/theming/css-setup#make-source-detection-explicit) explains this boundary.

If one variant is missing its styles, inspect the rendered `class` and the built CSS separately. **A Missing Rule** suggests source discovery; **A Rule That Loses** suggests cascade order or specificity; **A Winning but Unreadable Color** suggests the token pair. Another `cn()` call cannot generate a missing rule. Follow [CSS Setup](/docs/theming/css-setup) before adding local overrides.

Import the stylesheet once from the application entry or your framework's global-CSS entry:

```ts
import "./app.css";
```

Keep the existing `render` or hydration call in place. Avoid importing Tailwind repeatedly in component stylesheets. The full `@kamod-ch/themes/theme.css` entry includes preset and sidebar mappings; the smaller `@kamod-ch/ui/theme.css` entry serves simpler setups. [Choose One Theme Entry](/docs/theming/installation#choose-a-theme-entry) deliberately instead of combining both and relying on cascade order.

#### Verify One Surface and One Interaction

After the first render, inspect a background/foreground pair, a border and a button's focus state. A JavaScript import succeeding does not prove that CSS has loaded. Likewise, a styled server response does not prove that the client has hydrated. Test **Both Appearance and Behavior** before adding a complete block.

### Your First Working Screen

This small settings panel uses real local state and a native Kamod switch. It introduces semantic colors, an accessible name and an action with visible feedback. Render `StarterPanel` from your existing app or route; the example does not replace your application entry.

```tsx src/components/StarterPanel.tsx
import { useId, useState } from "preact/hooks";
import { Button } from "@kamod-ch/ui/button";
import { Switch } from "@kamod-ch/ui/switch";

export function StarterPanel() {
  const id = useId();
  const [enabled, setEnabled] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <section class="mx-auto max-w-lg rounded-xl border border-border bg-card p-6 text-card-foreground">
      <h1 class="text-xl font-semibold">Make yourself at home</h1>
      <p class="mt-2 text-sm text-muted-foreground">
        Try a preference before connecting your account service.
      </p>
      <div class="mt-6 flex items-center justify-between gap-4">
        <label id={`${id}-label`} for={id} class="text-sm font-medium">
          Product updates
        </label>
        <Switch
          id={id}
          aria-labelledby={`${id}-label`}
          checked={enabled}
          onCheckedChange={(next) => {
            setEnabled(next);
            setMessage("");
          }}
        />
      </div>
      <Button
        type="button"
        class="mt-6"
        onClick={() => setMessage(`Preview preference: ${enabled ? "on" : "off"}.`)}
      >
        Review preference
      </Button>
      <p role="status" class="mt-3 min-h-5 text-sm text-muted-foreground">
        {message}
      </p>
    </section>
  );
}
```

The `checked` value and `onCheckedChange` callback make this a **Controlled Switch**. `useId` connects its visible label without colliding with another instance. The stable `role="status"` region communicates the result of the button action. Nothing is persisted yet; that makes the example a useful baseline before introducing a service or [Stored Preferences](#signals).

Use `Tab` to reach both controls and `Space` to operate the switch. Resize the panel, try a dark theme and confirm the status text changes. Continue with the [Switch Reference](/docs/switch/installation), [Button Reference](/docs/button/installation) and [State Ownership](#give-state-one-owner) when extending the behavior.

## Components

Start with the **Meaning of the Interaction**, then choose the primitive. Use a button to perform an action, a link to navigate, a checkbox for independent selections and a switch for a binary preference. The [Component Selection Guide](/docs/components#choose-components) helps distinguish controls that can look similar while communicating different behavior.

### Choose a Component by Its Job

| Interface responsibility | Useful starting points                                                                                                      | What to decide                                                            |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Trigger an action        | [Button](/docs/button/installation), [Dropdown Menu](/docs/dropdown/installation)                                           | Is this a primary action, a secondary action or a list of actions?        |
| Collect a value          | [Input](/docs/input/installation), [Textarea](/docs/textarea/installation), [Select](/docs/select/installation)             | What value is valid, and how will the person understand it?               |
| Choose options           | [Checkbox](/docs/checkbox/installation), [Radio Group](/docs/radio-group/installation), [Switch](/docs/switch/installation) | Can choices combine, is one required, and when does the change apply?     |
| Reveal another layer     | [Dialog](/docs/dialog/installation), [Sheet](/docs/sheet/installation), [Popover](/docs/popover/installation)               | Does this need modal focus, a mobile surface or a small contextual panel? |
| Organize content         | [Tabs](/docs/tabs/installation), [Accordion](/docs/accordion/installation), [Card](/docs/card/installation)                 | Are people changing views, revealing detail or reading a related group?   |
| Navigate a workspace     | [Sidebar](/docs/sidebar/installation), [Breadcrumb](/docs/breadcrumb/installation)                                          | Where is the person, and what destinations are available?                 |

Read the **Usage Example and API Reference Together**. A prop table explains available configuration; the example shows the intended relationship between subcomponents. Before replacing a primitive with a custom `div`, check whether its existing composition already solves the problem.

### Import from a Public Entry Point

Use the installed package's public exports. Focused component imports make dependencies easy to read; the root barrel is also available for exported components.

```ts
import { Button } from "@kamod-ch/ui/button";
import { Input } from "@kamod-ch/ui/input";
import { Label } from "@kamod-ch/ui/label";
```

A path such as `@/components/kamod-ui/accordion` means **A Local Source File Behind Your App's Alias**. It is not a package you can install. Either bring the referenced source into your project or replace the import with a supported public package entry when the APIs match. Do not point an alias at an unrelated implementation merely to silence the resolver.

Keep **TypeScript and Runtime Resolution Aligned**. A `paths` entry in `tsconfig.json` helps the type checker; your bundler, test runner and server renderer must also resolve the alias. In Vite, merge an absolute `resolve.alias` into the existing configuration rather than replacing framework plugins. The [Block Import Walkthrough](/blocks/getting-started#bring-the-complete-source-into-your-app) shows the configuration in context.

Use `import type` for compile-time-only types and the package's `exports` map for runtime entry points. A repository file is not automatically a supported consumer import. Keep local `index.ts` barrels focused: navigation metadata should not import an entire page implementation just to obtain its label or count.

### Compose Behavior before Extracting an Abstraction

Keep the parts of a component together. A dialog needs a meaningful title, content and a way to close it. Its trigger and close primitive should retain their interaction behavior when they render a custom button.

```tsx src/components/PreviewHelp.tsx
import { Button } from "@kamod-ch/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@kamod-ch/ui/dialog";

export function PreviewHelp() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          About this preview
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Try the interface first</DialogTitle>
          <DialogDescription>
            This preview keeps changes in local state. Connect your own service when you are ready
            to save account preferences.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button">Got it</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

Here, `asChild` lets the primitive use the supplied button as its interactive element. It avoids wrapping one button inside another. Keep the child compatible with the primitive's prop and ref requirements. Try `Escape`, keyboard navigation and focus returning to the trigger before adapting the dialog to a longer workflow.

Keep the **Root, Trigger and Content Relationships** when extracting a wrapper. Forward the relevant `aria-*`, `disabled`, `type`, events and ref; a later prop spread can accidentally overwrite an earlier callback or label. Inspect the resulting DOM so the intended element actually receives those attributes.

Extract a component when it owns a repeated decision, such as a label/hint/error relationship or a consistent account action. Keep routes, permissions and service calls at the feature boundary so changing a visual composition does not require rewriting the operation. The [Component Behavior Guide](/docs/components#component-behavior) connects these contracts to practical examples.

#### Give State One Owner

Use local `useState` for a small interaction owned by one component. Lift the value when siblings need to coordinate. A controlled component receives its value and change callback from the same owner; avoid giving it a value that never changes or mixing unrelated `defaultValue` and controlled state.

When an operation becomes asynchronous, model **Waiting, Success and Failure** explicitly. A disabled button prevents duplicate interaction, but it does not explain why work is pending. Pair the control with a useful status message and a recovery path. Continue with [Component Feedback](/docs/components#component-feedback) and [Form Submission](#connect-submission-and-recovery).

Separate the **Saved Record**, the **Editable Draft** and values you can derive from them. A `dirty` flag can be calculated by comparing the draft's fields with the last confirmed response; it does not need its own independently updated copy. Keep shareable filters in route/query state when refresh and Back should restore them, and keep a local disclosure near the component that uses it.

`defaultValue` and `defaultChecked` describe initialization, not ongoing synchronization. When the selected record changes, deliberately initialize the new draft; do not overwrite typing whenever a background refresh returns a new object. Use stable record IDs as `key` values. A key derived from editable text can remount an input on every keystroke and lose focus.

```ts src/features/settings/draft.ts
export type WorkspaceDraft = { name: string; notifications: boolean };

export function hasChanges(saved: WorkspaceDraft, draft: WorkspaceDraft) {
  return saved.name !== draft.name || saved.notifications !== draft.notifications;
}
```

This comparison is intentionally about the fields the feature owns. After saving, update the baseline from the server's confirmed response. If newer edits are still allowed during the request, preserve them instead of silently replacing them with the earlier submitted snapshot.

### Style Your Interface

Keep three responsibilities separate: **Composition** decides what is present, **Component Styling** sets local hierarchy and density, and **Theming** supplies shared colors, typography and shape. Changing a token should not require rewriting a dialog's focus behavior; changing a layout should not require hardcoding a new palette into each child.

Start with supported `variant` and `size` props, then apply `class` for the surrounding layout. Use the [Component Styles Guide](/blocks/styles#start-with-supported-variants-and-sizes) for local treatment and [Theming & Styles](/docs/theming/installation) for the application-wide foundation.

#### Use Semantic Token Pairs

Pair `bg-background` with `text-foreground`, `bg-card` with `text-card-foreground`, and `bg-primary` with `text-primary-foreground`. Use `text-muted-foreground` for supporting information and `border-border` for ordinary boundaries. Those names describe roles that the theme can resolve differently in light and dark mode.

Prefer a subtle separator and clear subheading when content needs reading order; reserve a card for content that benefits from a shared boundary. Avoid reducing every description's contrast until it becomes difficult to read. See [Visual Hierarchy](/blocks/styles#establish-a-clear-visual-hierarchy) and [Semantic Tokens](/docs/theming/token-overrides#work-with-semantic-token-pairs).

#### Combine Classes Intentionally with cn

`cn` combines conditional class values and resolves recognized conflicting Tailwind utilities. Put **Base Classes First, State Classes Next and Consumer Classes Last** so a caller can override the component's defaults.

```ts src/components/surface-classes.ts
import { cn } from "@kamod-ch/ui/utils";

export function surfaceClasses(selected: boolean, className?: string) {
  return cn(
    "rounded-lg border border-border bg-card p-4 text-card-foreground",
    selected && "border-primary bg-primary/5",
    className,
  );
}

// The caller's spacing overrides the base p-4.
surfaceClasses(true, "p-6");
```

`cn` does not generate CSS. Tailwind still needs to discover complete class names in source. Prefer maps of literal utilities over constructing strings such as a color prefix plus an arbitrary value. The [`cn` Guide](/docs/cn/installation#usage) covers conditional arrays, objects and [Styling Integration](/docs/cn/installation#integration-styling).

Use `clsx`-style arrays and object maps to express conditions; `tailwind-merge` resolves recognized utility conflicts, so a later `px-6` can replace an earlier `px-3` without removing an independent `py-2`. Inspect [Arrays and Objects](/docs/cn/installation#arrays-and-objects) and [Overriding Defaults](/docs/cn/installation#override-defaults) when a wrapper combines several sources of classes. An arbitrary custom class still follows the ordinary CSS cascade.

Keep finite choices as **Complete Class Strings**, and use a validated CSS custom property for genuinely continuous values. Styling describes the value's presentation; it should not become another owner of whether the control is selected, disabled or valid.

#### Choose Presets and Appearance Controls

Use the [Theme Provider and Controls](/docs/theming/provider-controls) when your app needs a preset picker or light/dark control. Treat the **Preset** and **Color Scheme** as separate choices. A system preference should resolve to the current device appearance while still remembering that the person chose the system option.

Keep one appearance owner for the application. A preview's local theme selection is not automatically your app's global preference. If you render on the server, align the initial scheme and preset with hydration; read [Initial Appearance](/docs/theming/provider-controls#keep-the-first-render-consistent) before adding browser storage reads to component rendering.

`ThemeProvider` supplies `useTheme()` with the preset and scheme controls. `scheme` can be `system`, while `resolvedScheme` is the resulting light or dark appearance. Use `isThemePresetId` before accepting an arbitrary stored preset string, and consult the [Runtime API](/docs/theming/api-reference) before building your own controls.

For custom initial defaults, emit `getThemeInitScript()` in the framework's document head with the same values as the provider. Merely creating the string does not execute it. Respect the framework's CSP/nonce handling and use the existing owner of system changes. The [Storage Contract](/docs/theming/api-reference#storage-and-initial-appearance) explains the `theme` and `theme-preset` preferences.

Apply token overrides **After the Chosen Theme Entry**, and review both members of each surface/foreground pair in both schemes. Start with [Token Overrides](/docs/theming/token-overrides#customize-a-preset-with-tokens), then [Radius, Typography and Motion](/docs/theming/token-overrides#refine-radius-typography-and-motion). The [Optional Tailwind Preset](/docs/theming/tailwind-preset) is for an intentional compatible configuration-based pipeline; it is not an extra requirement for the CSS-first v4 setup above.

## Blocks

Choose a block when you need a **Complete Starting Composition**: navigation, workspace structure or an authentication screen. A block saves the work of assembling the initial layout, while leaving the business behavior and final design under your control. The [Block Collections](/blocks) show what is available; individual previews let you compare variants before adopting one.

### Choose the Layout before Copying It

| Starting point                                 | Good fit                                                        | Application work that remains                                        |
| ---------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------- |
| [Sidebar Collection](/blocks/sidebar)          | A navigation-led workspace with grouped destinations            | Real routes, current-location state, permissions and account data    |
| [Application Shell](/blocks/application-shell) | A larger reusable screen frame around changing page content     | Route integration, content boundaries and application actions        |
| [Login Layouts](/blocks/login)                 | An existing authentication flow that needs a composed interface | Authentication service, session handling, errors and redirect policy |
| [Signup Layouts](/blocks/signup)               | Account creation with a clear visual starting point             | Server validation, account creation and verification flow            |

Compare content needs before appearance: a long documentation tree and a short product menu use space differently. Test a narrow preview, long labels and keyboard navigation. A desktop screenshot alone does not reveal mobile focus behavior or whether a footer remains reachable in a short viewport.

### Bring the Complete Source into Your App

Start with the block's **Installation and Source Instructions**. The blocks workspace in this repository is private: paths such as `@kamod-ch/blocks/sidebar/sidebar-01` identify repository exports, not a published package installation. The documented workflow is to copy the supplied source into your application and use local imports. Follow the selected block's guidance rather than assuming every preview has the same import shape.

For copied source, preserve the relative relationships between the entry component, helpers, data and assets. Adjust application aliases deliberately. Install the directly imported UI, icon and other packages in the consuming workspace. Then render the unchanged composition once before connecting a router or replacing its state.

Adapt one boundary at a time: **Branding → Navigation Data → Page Content → Application Actions**. A wrapper may not forward `children` or accept the same props as its inner helper, so inspect the actual signature before changing the call site. Keep the smallest original composition available as a comparison.

Before calling the result integrated, search for `href="#"`, sample account names and callbacks that only close a menu. Replace them with a real destination or operation, or remove the unavailable action. Keep applicable license notices and record the source revision you copied; local files will not receive dependency updates automatically.

#### Read the Source Tree as a Dependency Map

In [Sidebar 01](/blocks/sidebar/sidebar-01#sidebar-01-copy), use the file tree to inspect the composition and its supporting modules. The `index.ts` file is often just an export boundary; the actual layout and navigation data live in other files. Do not interpret a one-line export as the entire implementation.

The **Copy** control preserves source formatting. Folding imports or wrapping long lines changes how you read the example, not the dependencies your app needs. Follow relative imports until you can identify every local file the entry requires. See [Bring the Complete Source](/blocks/getting-started#bring-the-complete-source-into-your-app) for the full sequence.

#### Replace Fixtures at Clear Boundaries

Replace sample users, destinations and navigation groups with your app's data. Keep these changes separate from structural styling so you can identify which change causes a regression. A useful application-owned navigation model can stay independent of any router:

```ts src/navigation/workspace-links.ts
export type WorkspaceLink = {
  label: string;
  href: string;
  exact?: boolean;
};

export const workspaceLinks: WorkspaceLink[] = [
  { label: "Overview", href: "/workspace", exact: true },
  { label: "Projects", href: "/workspace/projects" },
  { label: "Settings", href: "/workspace/settings" },
];

export function isCurrentLink(pathname: string, link: WorkspaceLink) {
  const path = pathname.replace(/\/+$/, "") || "/";
  return path === link.href || (!link.exact && path.startsWith(`${link.href}/`));
}
```

Pass the router's current pathname into this function when adapting your navigation. The path-segment boundary keeps `/workspace/projects-archive` from matching `/workspace/projects`. This small example assumes paths without a deployment prefix or query string; normalize those through your app's router. It is a data helper, not a new block API.

### Connect Navigation and Responsive Behavior

Use real links for destinations and buttons for local actions. Ensure the active destination remains understandable on subpages, set `aria-current` on the appropriate link and keep navigation labels stable. **Hiding a Link Is Not Authorization**: your service and route boundaries still enforce access.

For mobile navigation, preserve the block's existing sheet, close and focus behavior. Selecting a destination should lead to the intended route and leave the person able to use the page. Avoid replacing a working overlay primitive with visibility-only CSS. The [Sidebar Usage Model](/blocks/sidebar/sidebar-01#sidebar-01-usage-model) and [Responsive Navigation Guidance](/blocks/styles#adapt-navigation-without-losing-behavior) explain the composition.

### Adapt Appearance without Splitting the Theme

Keep block surfaces on the same token foundation as your components. Sidebar-specific tokens allow navigation to have its own surface treatment without becoming a separate color system. Adjust spacing, typography and supported variants first; then change shared tokens when the decision truly belongs to the whole application.

Use [Block Theming](/blocks/theming#understand-the-sidebar-token-family) for sidebar tokens and [Component Styles](/blocks/styles#adjust-density-as-a-system) for consistent density. Check collapsed navigation, long labels and focused controls after reducing padding. A compact layout still needs understandable targets and visible focus.

### Use Prompts as Implementation Context

The setup and adaptation prompts carry the example's context into a development workflow. Read the generated text before using it, include your real routing and state requirements, and point to the relevant source files. A prompt does not resolve omitted helpers or connect a service on its own.

Finish by comparing the adapted result with the original preview in light and dark themes, then test with your real content. Continue with the [Block Setup Checklist](/blocks/getting-started#verify-the-first-real-render) and [Application Shell 1](/blocks/application-shell/application-shell-1) when you need a broader workspace frame.

## Forms

Design a form around **The Task the Person Wants to Complete**. Ask for the smallest useful set of information, put related fields together and make the primary action describe the result. A profile edit, an invitation and a multi-step application need different amounts of structure.

The [Forms Overview](/docs/forms) connects design guidance, control selection and executable examples. Start with [Design the Task before the Fields](/docs/forms#design-forms), then use [Form Structure](/docs/forms#form-structure) to keep labels, descriptions and errors next to the controls they explain.

### Build a Small Native Form First

Use a visible `Label`, a stable input `id`, a meaningful `name` and an appropriate `type` and `autocomplete` hint. A placeholder can demonstrate a format, but it does not replace the field's name. Keep the entered value when a request fails so the person can correct or retry it.

A **Label Names the Value**, a hint explains the expected input and an error explains how to correct it. Preserve the hint when adding an error: `aria-describedby` can reference both IDs. Use `useId()` for repeated instances, and use `fieldset` with `legend` when several controls answer one question. The [`Field` Reference](/docs/field/installation) and [Form Structure](/docs/forms#form-structure) provide the corresponding compositions.

Read text from `event.currentTarget.value` with `onInput`. Keep the raw draft while the person types; normalize at the appropriate blur or submission boundary rather than unexpectedly trimming each keystroke. Use the form's `onSubmit` for Enter and the primary action, and `type="button"` for auxiliary actions such as revealing help.

This example uses browser email validation and application-owned submission. Supply `onSave` from your route or service layer. The component awaits that promise, prevents a duplicate save and distinguishes failure from success.

```tsx src/forms/ContactForm.tsx
import { useId, useRef, useState } from "preact/hooks";
import { Button } from "@kamod-ch/ui/button";
import { Input } from "@kamod-ch/ui/input";
import { Label } from "@kamod-ch/ui/label";

type ContactFormProps = {
  onSave: (email: string) => Promise<void>;
};

export function ContactForm({ onSave }: ContactFormProps) {
  const id = useId();
  const saving = useRef(false);
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <form
      class="max-w-md space-y-4"
      aria-busy={pending}
      onSubmit={async (event) => {
        event.preventDefault();
        if (saving.current) return;
        saving.current = true;
        setPending(true);
        setMessage("");
        try {
          await onSave(email.trim());
          setMessage("Contact details saved.");
        } catch {
          setMessage("We could not save your details. Please try again.");
        } finally {
          saving.current = false;
          setPending(false);
        }
      }}
    >
      <div class="space-y-2">
        <Label htmlFor={id}>Email address</Label>
        <Input
          id={id}
          name="email"
          type="email"
          autoComplete="email"
          required
          readOnly={pending}
          value={email}
          aria-describedby={`${id}-hint`}
          onInput={(event) => {
            setEmail(event.currentTarget.value);
            setMessage("");
          }}
        />
        <p id={`${id}-hint`} class="text-sm text-muted-foreground">
          Use the address where you want to receive account updates.
        </p>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save contact details"}
      </Button>
      <p role="status" class="min-h-5 text-sm text-muted-foreground">
        {message}
      </p>
    </form>
  );
}
```

`required` and `type="email"` let the browser reject an empty or malformed address before the submit handler runs. `readOnly={pending}` keeps the submitted value visible and stable while saving. The service callback belongs to the parent; use your actual endpoint and validate incoming data on the server as well.

This example uses one simple status message. For a larger form, distinguish field-level errors from a form-level service failure, connect error text with `aria-describedby` and set `aria-invalid` only when a field is invalid. See [Validation Messages](/docs/forms#validation-messages) for the complete pattern.

The `saving` ref blocks a second activation even before the next render disables the button. Keep the returned promise tied to the real write. If a request fails because of the network or permissions, explain that near the operation rather than marking a correct email address invalid. `TypeScript` describes expected shapes at compile time; a schema or explicit checks still validate untrusted responses at runtime.

### Introduce a Schema When Rules Need Reuse

Native validation is useful for simple constraints. A schema becomes valuable when rules must be reusable, values need explicit parsing or several fields interact. Keep the schema close to the data contract and translate its issues into messages that tell the person how to recover.

Use the **Schema** tab in [Form Examples](/docs/forms#form-examples) to compare schema validation with the native version. Those examples use `valibot`; introduce that dependency when you use the schema implementation. Client validation improves feedback, while server validation remains the boundary for trusted data.

#### Decide When Errors Appear

Submission is a useful first validation boundary. After an error is shown, revalidating the edited field helps the person see that they have fixed it. Avoid showing a wall of errors before they have had a chance to enter anything. The appropriate timing depends on the task and the consequence of a mistake.

Keep the error and its visual state in sync. A field should not remain marked invalid after its message disappears, and a successful edit should not erase an unrelated service failure without explanation. Read [Validation Timing](/docs/forms#validation-timing) before applying the same policy to every control.

### Use Formisch for Coordinated Form State

[`Formisch`](/docs/formisch/installation) coordinates values, validation and submission; Kamod supplies the interface controls. It is useful when field relationships, touched state, nested data or dynamic arrays make manual coordination difficult. The integration is optional for simple forms.

Install the additional dependencies when following the schema-first integration:

```bash package-manager
pnpm add @formisch/preact valibot
```

Follow the [Formisch Approach](/docs/formisch/installation#approach) to understand the division of responsibility, then [Schema and Setup](/docs/formisch/installation#schema-and-setup) for the first form. Compare its working example with the native one before moving a larger workflow across.

Read the store from `useForm`, pass it to Formisch's `Form` through `of`, and handle validated output in `onSubmit`. Formisch's [`Field`](/docs/formisch/installation#anatomy) exposes the field state and bindings; Kamod's `Field` supplies the visible layout. Alias the imports when both appear in one file so their different jobs stay clear. Follow the [Complete Demonstration](/docs/formisch/installation#demo) and [Anatomy](/docs/formisch/installation#anatomy) before extracting pieces.

#### Connect Each Control's Actual Event Contract

Text inputs expose input events and string values. A `Checkbox`, `Switch` or `Select` may expose a checked/value callback instead. Connect the documented callback to the form field rather than pretending every component behaves like a native text input.

Use the dedicated [Input](/docs/formisch/installation#input), [Select](/docs/formisch/installation#select), [Checkbox](/docs/formisch/installation#checkbox) and [Switch](/docs/formisch/installation#switch) integration examples. Keep display labels separate from the values your schema expects, particularly when an option label is translated.

#### Grow into Nested and Repeated Fields

Introduce repeated fields only when the task needs them. Preserve stable item identity when adding or removing entries, associate each error with the correct control and keep the next focus destination understandable. Resetting a form should restore an intentional baseline, not unexpectedly discard a person's in-progress work.

Continue with [Complex Forms](/docs/formisch/installation#complex-forms), [Array Fields](/docs/formisch/installation#array-fields) and [Resetting a Form](/docs/formisch/installation#resetting-form). Keep a small working version alongside the larger implementation so you can isolate integration problems.

For `FieldArray`, use each stable item ID as the row `key` while using the current index in its field path. Insert and remove through the form store so values and validation remain coordinated. A form `reset` restores its inputs and validation state; clear any separately owned service-result state yourself, according to the visible reset action's promise.

### Connect Submission and Recovery

Treat a save as a **Lifecycle**, not a single click. Explain what is happening while the returned promise is pending, show success only after it resolves and retain useful values when it rejects. Do not start asynchronous work without returning or awaiting it; otherwise the form cannot know when submission has finished.

| Stage              | What the interface should communicate                     | What your app supplies                                |
| ------------------ | --------------------------------------------------------- | ----------------------------------------------------- |
| Editing            | Clear labels, instructions and relevant constraints       | Initial values and validation rules                   |
| Invalid submission | A useful explanation close to each affected field         | Parsed field issues and an appropriate focus strategy |
| Pending request    | A stable value, a busy action and no duplicate submission | The real promise and request policy                   |
| Successful save    | A confirmed result and a clear next step                  | Updated application data or navigation                |
| Failed save        | Retained input and an actionable retry message            | Error classification and recovery behavior            |

Read [Submission Lifecycle](/docs/forms#submission-lifecycle), [Form Recovery](/docs/forms#form-recovery) and [Formisch Validation Modes](/docs/formisch/installation#validation-modes) when moving beyond the first example. An authentication layout follows the same feedback principles, but additionally needs a real session and authorization implementation.

Decide how a remote refresh affects an unfinished draft. A new record can initialize a new form; a refreshed version of the same record should follow an explicit keep, reload or reconcile policy. When the service supports revisions, submit the expected revision and handle conflicts separately from an ordinary retry.

**A Client-Side Guard Is Not a Write Guarantee.** A timed-out request may already have reached the server. Record creation can need an idempotency policy or a follow-up read before retrying. Aborting the client does not prove that a write was rolled back. For optimistic updates, define how failure restores or reconciles the saved state before presenting the prediction as confirmed success.

## Packages

The Kamod ecosystem supplies focused companions to `@kamod-ch/ui`. Add a package when it owns a responsibility your feature actually needs. **One Value Should Have One Owner**: avoid copying the same preference into local state, a signal and a reducer store just because all three are available.

The [Packages Directory](/docs/packages#choose-packages) explains the selection process and includes working examples. The table below is a map of the wider stack; the following subsections explain where each piece fits.

| Capability                 | Package or project  | Use it for                                                  |
| -------------------------- | ------------------- | ----------------------------------------------------------- |
| Interface controls         | `@kamod-ch/ui`      | Components, interactions and the building blocks of layouts |
| Shared appearance          | `@kamod-ch/themes`  | Theme tokens, presets and application appearance controls   |
| SVG icons                  | `@kamod-ch/icons`   | Consistent, typed icon components                           |
| Reusable behavior          | `@kamod-ch/hooks`   | Focused Preact hooks for state and browser interactions     |
| Persistent reactive values | `@kamod-ch/signals` | Preferences that need reactivity and a storage strategy     |
| Explicit state transitions | `@kamod-ch/state`   | Actions, reducers and coordinated domain behavior           |
| Localization               | `@kamod-ch/i18n`    | Typed messages, locale handling and formatting              |
| Animation                  | `@kamod-ch/motion`  | Purposeful movement and interaction feedback                |
| Data visualization         | Kamod Charts        | Chart-focused components and visualization primitives       |
| Documentation sites        | PreactPress         | Publishing Preact-oriented documentation such as this site  |

### Icons

`@kamod-ch/icons` provides Preact SVG components across several icon families. Choose a coherent family for the interface and use its explicit subpath so imports remain easy to understand. Check the exact export name in the [Icon Guide](/docs/icons-package/installation) or [Icon Catalog](https://kamod-ch.github.io/kamod-icons/) before copying an icon from another library's examples.

```tsx src/components/RefreshButton.tsx
import { RefreshCwIcon } from "@kamod-ch/icons/lucide";
import { Button } from "@kamod-ch/ui/button";

export function RefreshButton({ onRefresh }: { onRefresh: () => void }) {
  return (
    <Button type="button" variant="outline" onClick={onRefresh}>
      <RefreshCwIcon size={16} aria-hidden="true" />
      Refresh results
    </Button>
  );
}
```

The visible text supplies the button's accessible name, so the SVG is decorative. If you remove the text for a compact control, give the button an `aria-label` and add a tooltip when extra context helps; a recognizable picture alone does not provide a reliable accessible name. Inherit the surrounding color unless the icon communicates an intentional semantic state.

**Keep the Action Named When Space Is Tight.** A compact search action uses the same icon family and delegates opening the search interface to its parent. The button owns the accessible name; `size="icon"` supplies the control's target area independently of the SVG's dimensions.

```tsx src/components/SearchAction.tsx
import { SearchIcon } from "@kamod-ch/icons/lucide";
import { Button } from "@kamod-ch/ui/button";

export function SearchAction({ onSearch }: { onSearch: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Search projects"
      onClick={onSearch}
    >
      <SearchIcon size={16} aria-hidden="true" />
    </Button>
  );
}
```

Use this beside a [Dialog](/docs/dialog/installation#usage) or [Command](/docs/command/installation#usage) that your application already controls. Keep a visible label in unfamiliar contexts; an icon-only variation is useful when the surrounding toolbar already makes the action clear.

Continue with [Icon Installation](/docs/icons-package/installation#installation), [Icon Usage](/docs/icons-package/installation#usage) and the [Kamod Icons Repository](https://github.com/kamod-ch/kamod-icons).

### Hooks

`@kamod-ch/hooks` packages reusable Preact behavior: small state helpers, lifecycle utilities and browser-oriented interactions. Reach for a hook when it removes repeated behavior with a clear contract. Plain `useState` remains a good choice for a single local value.

For example, the installed `useToggle` API returns the current value and named actions. This makes a two-state action explicit while leaving the visual control in Kamod UI:

```tsx src/components/DetailsToggle.tsx
import { useId } from "preact/hooks";
import { useToggle } from "@kamod-ch/hooks";
import { Button } from "@kamod-ch/ui/button";

export function DetailsToggle() {
  const id = useId();
  const [open, actions] = useToggle(false);
  return (
    <div class="space-y-3">
      <Button
        type="button"
        variant="outline"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => actions.toggle()}
      >
        {open ? "Hide details" : "Show details"}
      </Button>
      <p id={id} hidden={!open} class="text-sm text-muted-foreground">
        The hook owns the value; the component owns its presentation.
      </p>
    </div>
  );
}
```

Use the [Hooks Guide](/docs/hooks-package/installation) to choose the right utility, then check its actual signature and cleanup behavior. Hooks that observe the DOM, storage or viewport need a deliberate server-rendering boundary. Do not assume that a similarly named React hook has the same API. Explore the [Kamod Hooks Repository](https://github.com/kamod-ch/kamod-hooks) for implementation details.

**Keep Typing Immediate; Delay Only the Derived Work.** `useDebounce` is useful when a changing value drives a more expensive calculation. Here the `Input` updates immediately, while the local results wait for a short pause. Pass projects with stable `id` and `name` values through `items`; the hook does not fetch data or cache results.

```tsx src/components/ProjectFilter.tsx
import { useId, useState } from "preact/hooks";
import { useDebounce } from "@kamod-ch/hooks";
import { Input, Label } from "@kamod-ch/ui";

type Project = { id: string; name: string };

export function ProjectFilter({ items }: { items: Project[] }) {
  const id = useId();
  const [query, setQuery] = useState("");
  const settledQuery = useDebounce(query, { wait: 250 });
  const matches = items.filter(({ name }) =>
    name.toLowerCase().includes(settledQuery.trim().toLowerCase()),
  );

  return (
    <div class="space-y-3">
      <Label htmlFor={id}>Find a project</Label>
      <Input id={id} value={query} onInput={(event) => setQuery(event.currentTarget.value)} />
      <p role="status">{matches.length} matching projects</p>
      <ul>
        {matches.map(({ id, name }) => (
          <li key={id}>{name}</li>
        ))}
      </ul>
    </div>
  );
}
```

Try a fast sequence of keystrokes, then clear the field: **Typing Stays Responsive**, and the results settle after `250` milliseconds. A short, inexpensive list often needs no debounce at all. For remote search, also cancel or ignore stale requests; delaying a query alone cannot prevent an older response from replacing newer results. Continue with [Hooks Usage](/docs/hooks-package/installation#usage) and [Cleanup and Ownership](/docs/packages#package-cleanup).

### Signals

`@kamod-ch/signals` adds persistence-oriented utilities around reactive values. It suits a small preference that several parts of an app read and that should survive a reload. It is separate from `@preact/signals`, which supplies the underlying Preact signals runtime.

Choose the **Storage Lifetime** before choosing an API. A per-tab preference, a device preference and a server-visible preference have different requirements. Define a stable key, an intentional default and what should happen when stored data is unavailable or belongs to an older shape. Persist the smallest useful value instead of a copy of the whole screen.

Keep the initial server render deterministic. Browser storage cannot supply a request-specific server value, and a mutable module-level object must not become a container for different users' data. Use the [Signals Installation and Examples](/docs/signals-package/installation), [Storage Decisions](/docs/packages#package-persistence) and [Server & First Render](/docs/packages#package-ssr) before wiring persistence into a shared interface.

The [Kamod Signals Repository](https://github.com/kamod-ch/kamod-signals) documents the package's storage adapters and APIs. Check those contracts against your installed version, especially for serialization, hydration and subscription cleanup.

Treat missing, malformed or unavailable storage as a normal condition with a safe default. Version a stored shape when it can change, and decide whether another tab's updates should synchronize. Keep temporary overlays and sensitive account data out of casual preference storage. On a shared device, an account change must not accidentally restore the previous person's private draft.

**Save One Harmless Display Preference.** The control below uses a versioned local-storage key and validates restored data as a boolean. Its outer component waits until mounting before creating the browser-backed control, so the server and the first client render show the same placeholder.

```tsx src/components/CompactPreference.tsx
import { useEffect, useState } from "preact/hooks";
import { usePersistedSignal } from "@kamod-ch/signals";
import { Button } from "@kamod-ch/ui/button";

function readCompact(raw: string): boolean {
  const value: unknown = JSON.parse(raw);
  return typeof value === "boolean" ? value : false;
}

function SavedPreference() {
  const compact = usePersistedSignal("workspace:compact:v1", false, {
    storage: "local",
    deserialize: readCompact,
  });
  return (
    <div class="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        aria-pressed={compact.value}
        onClick={() => {
          compact.value = !compact.value;
        }}
      >
        Compact rows: {compact.value ? "on" : "off"}
      </Button>
      <Button type="button" variant="ghost" onClick={() => compact.reset()}>
        Restore default
      </Button>
    </div>
  );
}

export function CompactPreference() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <SavedPreference /> : <p>Loading display preference…</p>;
}
```

**Check the Reload, Not Only the Click.** Turn the preference on, reload, then restore the default and reload again. In this package, `reset()` restores the initial value; `clear()` also removes the stored entry. Keep `readCompact` outside the component so its identity stays stable. Malformed JSON falls back to the initial value, while a valid JSON value of the wrong type is normalized by the reader.

This example owns one preference control. To apply it across a list and toolbar, lift that ownership into their shared parent and pass the value and actions down. Do not create separate writable copies in each child. For appearance that must be correct **Before First Paint**, use a server-readable preference or the [Theme Initialization Guide](/docs/theming/provider-controls#keep-the-first-render-consistent) instead of displaying an intermediate layout.

### State

`@kamod-ch/state` is useful when named actions and explicit reducer transitions make a feature easier to understand. A multi-step editor, coordinated filters or a domain workflow may benefit from a store with testable transitions. A single open/closed disclosure usually does not need that structure.

Separate **Domain State** from transient presentation. Keep the selected record or workflow stage in the appropriate shared owner; keep an unrelated tooltip's visibility local. Dispatch meaningful events such as a submitted change or a received result, then derive the visible state instead of maintaining several contradictory flags.

Use the [State Guide](/docs/state-package/installation) for setup and examples, the [State API Reference](/docs/state-package/installation#api-reference) for package boundaries, and the [Kamod State Repository](https://github.com/kamod-ch/kamod-state) for implementation details. If you combine a store with persisted signals, document which system owns the value and which only exposes or persists it.

**Represent One Save Operation with One Status.** This example follows the [State Repository API](https://github.com/kamod-ch/kamod-state); confirm the available distribution and its setup instructions before adding it to your app. Named events make the transition from `idle` to `saving`, then `saved` or `error`, explicit. This small store factory can be created for one editor or one server request without sharing mutable state between them.

```ts src/state/save-state.ts
import { createAction, createStore } from "@kamod-ch/state";

export const saveStarted = createAction("draft/save-started");
export const saveSucceeded = createAction("draft/save-succeeded");
export const saveFailed = createAction("draft/save-failed");
type SaveAction = ReturnType<typeof saveStarted | typeof saveSucceeded | typeof saveFailed>;
type SaveState = { status: "idle" | "saving" | "saved" | "error" };

export function createSaveStore() {
  return createStore<SaveState, SaveAction>({
    reducer: (state = { status: "idle" }, action) => {
      if (saveStarted.match(action)) return { status: "saving" };
      if (state.status !== "saving") return state;
      if (saveSucceeded.match(action)) return { status: "saved" };
      if (saveFailed.match(action)) return { status: "error" };
      return state;
    },
  });
}
```

The request handler dispatches `saveStarted()` before awaiting your service, then dispatches the success or failure event. **The Reducer Never Sends the Request.** Derive a button's `disabled` state from `status === "saving"`, retain the user's input on failure, and allow a retry. Also guard the handler against duplicate submissions; if overlapping requests are allowed, give them identities so stale completions cannot update the current operation.

Use `store.getState()` to inspect a snapshot in a handler or test. A rendered view needs the package's `createStoreContext`, provider and `useSelector` subscription; reading a snapshot once does not make it reactive. Continue with the [State Integration Guide](/docs/state-package/installation#integration) and [Async Form Ownership](/docs/forms#form-submission) before attaching a real save button.

### i18n

`@kamod-ch/i18n` helps organize typed translation messages and locale-aware formatting. Keep user-facing strings in a message schema, give every supported locale a deliberate fallback and format dates, numbers and quantities for the active locale. The interface should remain understandable when translated text is longer than its original version.

Translate the parts people encounter beyond the main heading: **Accessible Names, Validation Messages, Empty States and Pending Actions**. Avoid building a sentence by concatenating fragments whose order changes across languages. Keep stored identifiers and option values stable while translating their visible labels.

For server-rendered applications, create request-appropriate locale state and hydrate with the same initial locale. Do not share a mutable active locale across users. Start with [i18n Installation](/docs/i18n-package/installation), then inspect the [Usage Examples](/docs/i18n-package/installation#usage) and [Kamod i18n Repository](https://github.com/kamod-ch/kamod-i18n).

**Translate the Whole Message and Format the Value Separately.** The default locale supplies the key structure; `Messages<typeof en>` checks the German object against it. Named interpolation lets a translator move the person's name, while `number()` handles the locale's number and currency conventions.

```ts src/i18n/messages.ts
import { createI18n, type Messages } from "@kamod-ch/i18n";

const en = {
  actions: { save: "Save changes" },
  workspace: { welcome: "Welcome, {name}" },
} as const;
const de = {
  actions: { save: "Änderungen speichern" },
  workspace: { welcome: "Willkommen, {name}" },
} satisfies Messages<typeof en>;

export function createMessages(locale: "en" | "de") {
  return createI18n({ locale, fallbackLocale: "en", messages: { en, de } });
}

// Call within an application/request boundary, not a shared server singleton.
export function workspaceCopy(locale: "en" | "de", name: string) {
  const messages = createMessages(locale);
  return {
    welcome: messages.t("workspace.welcome", { name }),
    saveLabel: messages.t("actions.save"),
    amount: messages.number(1299.5, { style: "currency", currency: "EUR" }),
  };
}
```

`workspaceCopy("de", "Alex")` returns “Willkommen, Alex”, the German save label and a localized euro amount. Render those results as text, and keep the underlying amount numeric. **Formatting Does Not Convert Currencies**: `currency: "EUR"` describes the value you already have. To change languages in a mounted interface, use `I18nProvider` and `useI18n` from `@kamod-ch/i18n/preact`; the adapter subscribes consumers to locale changes. Keep the provider's instance stable for the lifetime of its tree and recreate it per server request. The [i18n Integration Guide](/docs/i18n-package/installation#integration) covers that ownership boundary.

### Motion and Charts

Use **Motion to Explain a Change**: a panel opening, feedback arriving or an element entering a layout. Keep essential information available without animation, respect reduced-motion preferences and avoid movement that shifts a person's target while they are trying to interact. The [Kamod Motion Repository](https://github.com/kamod-ch/kamod-motion) is the reference for the motion package's supported APIs; use the version installed by your project.

**Animate Feedback Without Moving the Target.** This status stays mounted while the `saved` prop changes, so its text remains useful even when movement is disabled. `initial={false}` avoids an entrance animation, and `reducedMotion="user"` follows the user's preference.

```tsx src/components/SaveFeedback.tsx
import { Motion } from "@kamod-ch/motion";

export function SaveFeedback({ saved }: { saved: boolean }) {
  return (
    <Motion
      as="p"
      role="status"
      initial={false}
      animate={{ opacity: saved ? 1 : 0.65 }}
      transition={{ duration: 0.18 }}
      reducedMotion="user"
      class="text-sm"
    >
      {saved ? "Changes saved." : "You have unsaved changes."}
    </Motion>
  );
}
```

Let the real save result set `saved`; animation is only its presentation. This uses the primitives in `@kamod-ch/motion`, whose `motion` peer must also be installed. The separate [UI Motion Guide](/docs/ui-motion/installation) covers motion-enabled Kamod compositions. Keep the distinction clear when choosing imports.

Use **Charts to Explain Data**, with labels, meaningful units and a useful empty or error state. A chart should fit its container and remain interpretable in both themes. Provide an adjacent summary or table when that makes the information easier to access, and avoid relying on color alone to distinguish series.

Explore the [Kamod Charts Repository](https://github.com/kamod-ch/kamod-charts) for its visualization components. Check the available release and its installation instructions before adopting a source example; companion repositories can advance independently of the UI package. Neither motion nor charts is required for the basic Kamod setup.

**Start with One Series and an Honest Summary.** The example below follows the [Chart Quick Start](https://github.com/kamod-ch/kamod-charts#quick-start): explicit data, a labeled series and deterministic initial dimensions. The current chart package must be installed separately. Import `@kamod-ch/charts/theme.css` once in your application entry point so its semantic chart tokens are available.

```tsx src/components/CompletedTasksChart.tsx
import { LineChart } from "@kamod-ch/charts/line";

const data = [
  { day: "Mon", completed: 8 },
  { day: "Tue", completed: 12 },
  { day: "Wed", completed: 10 },
];

export function CompletedTasksChart() {
  return (
    <figure class="min-w-0 space-y-2">
      <LineChart
        data={data}
        xKey="day"
        xScale="point"
        series={[{ key: "completed", label: "Completed tasks", color: "var(--chart-1)" }]}
        height={240}
        initialWidth={480}
        responsive
        showGrid
        tooltip
        title="Completed tasks by day"
        description="8 on Monday, 12 on Tuesday and 10 on Wednesday."
      />
      <figcaption class="text-sm text-muted-foreground">
        30 tasks completed across three days; Tuesday had the highest total.
      </figcaption>
    </figure>
  );
}
```

`xScale="point"` preserves these categorical day labels. `initialWidth` supplies the initial layout; `responsive` lets the chart follow its container after hydration. For live data, derive the description and summary from the same records as the plot, and render a meaningful empty state before displaying an empty dataset. Continue with [Chart Gallery and Documentation](https://kamod-ch.github.io/kamod-charts/) and the [Chart Theming Guide](https://kamod-ch.github.io/kamod-charts/foundations/colors-and-themes/).

### PreactPress and the UI Repository

[PreactPress](https://github.com/kamod-ch/preactpress) powers this documentation experience. It is relevant when you want to publish Preact-based documentation or contribute to this site; it is not a runtime requirement for an application using Kamod UI.

The [Kamod UI Repository](https://github.com/kamod-ch/kamod-ui) contains the core components, blocks and this documentation. Follow the relevant source link from a component or block page to inspect its implementation. Compare that source with your installed release before relying on a new prop or export, and keep applicable license notices when reusing code.

**Document the Decision Beside the Example.** In a PreactPress project, a small Markdown page can explain what a component owns and link readers to the next useful reference. This is a documentation file, not a module imported into your application:

```markdown docs/project-settings.md
---
title: Project settings
description: How our settings screen saves changes and explains failures.
---

## Save behavior

The **parent screen** owns the request and retains entered values on failure.
The `Button` submits the form; it does not own the persistence operation.

## Before merging

Check keyboard submission, a failed save and a successful retry.
See the [Kamod form guide](https://kamod-ch.github.io/kamod-ui/docs/forms).
```

Keep notes specific: name the real handler, explain the recovery path and link to the source that implements it. When contributing to **This Repository**, follow its existing page metadata and navigation conventions rather than starting another documentation app. The [Project Structure](#check-the-application-boundary), [Component References](/docs/components#component-state) and [Package Sources](/docs/packages#package-imports) help readers move from an explanation to the code it describes.

## Ship a Complete Feature

You now have the pieces of one working interface: **A Styled Surface, an Interaction Contract, Application Data and a Recovery Path**. Review them as a single journey. A component's primitive behavior is a starting point; the composed screen still owns its labels, focus destinations, content priority and service boundaries.

### Preserve Accessible Interaction

Begin with **Names and Relationships**. A link's `href` identifies a destination; a button performs an action. Keep visible labels consistent with accessible names, give icon-only actions an `aria-label` that describes their purpose, and mark decorative SVGs with `aria-hidden`. Distinguish repeated actions with useful context, such as “Open Cedar” rather than a list of identical “Open” links.

For fields, connect `Label`, hints and errors through a stable `id` and `aria-describedby`. Group related choices with `fieldset` and `legend`, preserve useful hints when errors appear, and use `aria-invalid` for a genuinely invalid field. A permission or network failure belongs beside the operation, not on every input. Continue with [Form Structure](/docs/forms#form-structure), [Field](/docs/field/installation) and [Validation Messages](/docs/forms#validation-messages).

**Follow the Keyboard Journey**, not only the click path. Use `Tab` and `Shift+Tab` between controls and the documented arrow-key behavior within [Tabs](/docs/tabs/installation) or [Dropdown](/docs/dropdown/installation). Keep DOM order consistent with the reading sequence, avoid positive `tabindex` values and let the active widget own its keys. A global `Escape` listener must not unexpectedly close the whole task when a nested menu is active.

Opening a [Dialog](/docs/dialog/installation) or [Sheet](/docs/sheet/installation) moves the interaction into a new context. Preserve the primitive's focus handling and check every supported close path. If completion deletes the trigger, choose a surviving destination, such as the next record or the list heading with `tabIndex={-1}`. Keep **Focus and Selection Distinct**, and ensure borders, sticky regions and overflow do not hide `:focus-visible`.

Give asynchronous feedback **One Clear Owner**. Keep a small `role="status"` region mounted before updating its text; avoid making the whole form live or announcing the same result through both a toast and a nearby message. `aria-busy` can affect announcement timing, so check whether feedback intended for immediate reading belongs outside the busy region. Disabled controls may not receive keyboard focus: put the reason an action is unavailable nearby, not only in its tooltip. If you choose `aria-disabled`, also prevent the action; the attribute alone does not do so.

Use **Automated Checks, Keyboard Testing and an Assistive-Technology Pass** for different kinds of evidence. An automated scan cannot prove that a focus destination or announcement makes sense. Record the actual journey and combinations you tested, and use [Component Accessibility](/docs/components#component-accessibility) as the next focused reference.

### Design for the Available Space

Preserve the **Smallest Complete Task**: the information someone needs, the action they can take and the result they must understand. Stack supporting regions before shrinking every control. An unfamiliar action needs visible wording; a familiar utility can use a compact icon with an accessible name. A deliberate second row is often more usable than a toolbar of tiny symbols.

A component can be narrow inside a wide screen. Use viewport breakpoints for the page frame and container-aware layout where a panel's own width matters. Give shrinking flex children `min-width: 0` and flexible grid tracks `minmax(0, 1fr)`. Then choose whether that particular content should wrap, truncate or scroll. Do not hide overflow on the whole feature merely to conceal one long path; that can also clip focus and overlays.

**Wrap Reading Content; Preserve Comparison Structure.** This guide's verification table below reflows descriptions into two columns. A dense numeric matrix may still need a labeled, keyboard-reachable local scroll region. Source code can scroll horizontally when very narrow wrapping would destroy its indentation; Copy should retain the original source. See the [Forms Design Table](/docs/forms#design-forms) and [Responsive Styling Guide](/blocks/styles#keep-responsive-intent-explicit) for related decisions.

Keep the same **DOM Reading Order** when columns stack. Use headings, modest separators and related text to explain structure instead of adding another padded card around every paragraph. When labels shorten, retain the distinguishing part of a filename or action; a hover-only tooltip is not a reliable way for a touch user to recover missing meaning.

Test **Width and Height**. Open a mobile menu, scroll to a low destination, follow a section link and reopen it. In a form overlay, check the submit and close actions with the software keyboard visible. Keep tall content scrollable within the available viewport, account for safe-area padding when actions sit against an edge, and check landscape as well as portrait. Start with the existing [Navigation Composition](/blocks/styles#adapt-navigation-without-losing-behavior).

Try 320px, an intermediate width and a wide layout, plus the space just before and after your actual breakpoints. Add zoom, long translated labels, empty states and errors. Gate optional hover treatments with `(hover: hover)` and `(pointer: fine)`; this site additionally disables them on small screens. Keep `:focus-visible`, selected state and essential feedback independent of hover. Respect `prefers-reduced-motion` and preserve readable status text when an animation is removed.

### Keep Rendering and Work Predictable

**Rendering Describes the Current Inputs.** Requests, subscriptions, timers and DOM measurements need a deliberate owner and lifetime. Derive simple labels and filtered values during rendering; perform a save in its event/service boundary; subscribe to browser changes in an effect or shared owner. A render can repeat without a new user action, so it should not start another listener or request each time.

For SSR, keep the server and first client render compatible. A `typeof window` guard prevents a missing-global exception but does not fix markup that changes between those two renders. Use stable `useId()` relationships and record keys, pass an agreed date/locale context, and prefer CSS for presentation-only adaptation. Keep user-specific mutable state within the request or appropriate provider; immutable navigation metadata can have a different, shared lifetime. See [Package SSR Guidance](/docs/packages#package-ssr), [i18n](#i18n) and [Initial Appearance](/docs/theming/provider-controls#keep-the-first-render-consistent).

Keep **Cleanup beside Setup**: pair listeners with `removeEventListener`, timers with `clearTimeout` or `clearInterval`, animation frames with `cancelAnimationFrame`, and observers with `disconnect`. Effect dependencies identify the record or resource the work belongs to. Omitting one to suppress reruns can leave a callback acting on yesterday's value. [Package Cleanup](/docs/packages#package-cleanup) covers the same ownership across companion utilities.

Protect the current screen from **Out-of-Order Responses**. Prefer your framework's loader or established data layer when it already owns caching and navigation. For a small client-side read, this example keeps the response tied to its record and cancels obsolete work:

```tsx src/hooks/useProjectName.ts
import { useEffect, useState } from "preact/hooks";

type Result =
  | { projectId: string; status: "loading" | "error" }
  | { projectId: string; status: "ready"; name: string };

export function useProjectName(projectId: string): Result {
  const [result, setResult] = useState<Result>({ projectId, status: "loading" });
  useEffect(() => {
    const controller = new AbortController();
    setResult({ projectId, status: "loading" });
    async function load() {
      try {
        const response = await fetch(`/api/projects/${encodeURIComponent(projectId)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Request failed");
        const value: unknown = await response.json();
        if (
          !value ||
          typeof value !== "object" ||
          !("name" in value) ||
          typeof value.name !== "string"
        ) {
          throw new Error("Unexpected response");
        }
        if (!controller.signal.aborted) {
          setResult({ projectId, status: "ready", name: value.name });
        }
      } catch {
        if (!controller.signal.aborted) setResult({ projectId, status: "error" });
      }
    }
    void load();
    return () => controller.abort();
  }, [projectId]);
  return result.projectId === projectId ? result : { projectId, status: "loading" };
}
```

Your application supplies `/api/projects/:id`, authorization and its error policy; this is not a Kamod endpoint. The response is checked at runtime, and the returned record identity prevents the previous name being displayed as the newly selected project before the effect runs. Intentional cancellation does not become a failure message on the next screen. Canceling a read is different from undoing a server write.

**Load Expensive Features at Useful Boundaries.** A large editor, optional chart or source viewer can have its own loading and failure state. Keep labels and route metadata separate from those implementations, and reserve enough space for the fallback. Check a direct cold-route load as well as a warm client-side transition; splitting modules should not create a serial chain of avoidable requests.

Measure the interaction before adding `useMemo` or `useCallback`. Separate network time, scripting, layout and painting. A large dataset may need pagination or filtering at the data layer; repeated layout work may need fewer measurements. Prefer CSS for wrapping and spacing, pause observers when their view no longer needs them, and keep the original code string separate from a presentation-only wrap setting. Compare the same data and environment before and after an optimization.

### Verify the Whole Journey

Write one **Observable Contract**: “Change a preference, save it, see confirmation and find the saved value after returning.” Add its failure path: a rejected save preserves the draft and allows a successful retry. These statements tell you what evidence you need; the internal name of the state hook does not.

Use a unit test for a pure transformation, a component test for a controlled value/callback relationship and a real browser for focus, routing and layout. Query controls by **Role and Accessible Name**, hold a promise pending deliberately instead of depending on a slow live service, and wait for an observable result rather than a fixed delay. Use the table as a final walkthrough, with each check linking to its detailed reference.

| Check                                                              | A useful verification                                                                                                                                                                     |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Installation](/docs/packages#package-installation)                | **Resolve every directly imported dependency.** Start from the application workspace and its lockfile; check versions and peers instead of relying on a sibling workspace's installation. |
| [Styles](/docs/theming/css-setup)                                  | **Confirm utilities and semantic token values in the production build.** Inspect the actual surface, focused control and error variant in light and dark mode.                            |
| [Composition](#compose-behavior-before-extracting-an-abstraction)  | **Keep triggers, labels and content connected.** Open, close and reopen the control; check the accessible name and where focus returns after completion.                                  |
| [Input and save](/docs/forms#form-review)                          | **Exercise invalid input, pending work, failure and recovery.** Keep the submitted value available, prevent duplicate writes and finish the retry with a confirmed result.                |
| [Navigation](/blocks/getting-started#verify-the-first-real-render) | **Reach real routes on desktop and mobile.** Follow a deep link, refresh it directly and try Back/Forward; a menu selection should leave the destination usable.                          |
| [Delivery](#diagnose-the-boundary-that-failed)                     | **Load the built page and its assets without startup errors.** Test a nested URL under the intended base path, then navigate with a fresh cache and repeat the primary action.            |

Repeat the interesting transition **At Least Twice**: reopen the dialog, retry the save and revisit the route. Switch from record A to B while responses arrive out of order. Test one result, no results, a long label and a record that disappears. A second attempt often reveals a stale subscription or permanently disabled retry that a successful screenshot misses.

#### Diagnose the Boundary That Failed

For missing styles, inspect **CSS Request → Source Discovery → Winning Rule → Token Pair**. If the rule is absent, check the global import and scanned paths. If it exists but loses, inspect the cascade. If it wins but cannot be read, inspect the actual foreground/background pair. Start with [CSS Setup](/docs/theming/css-setup#make-source-detection-explicit), [`cn` Integration](/docs/cn/installation#integration-styling) or the [Theme Diagnosis Sequence](/blocks/theming#diagnose-theme-problems-in-order), depending on that evidence.

For interaction problems, trace **Input → Callback → Owner → Updated Prop**. A value that snaps back can have a fixed controlled prop; an input that loses focus can have an unstable `key`. If many controls are inert together, inspect the first client startup or hydration error before changing each handler. For overlays, record `document.activeElement` before and after the transition and compare the documented [Dialog Structure](/docs/dialog/installation) before adding another focus trap or timeout.

For route problems, compare **Direct Visit, Client Navigation, Refresh and History**. Verify asset URLs and internal links under the deployment base path. A working development root does not prove that a nested production URL can load. When the project has generation or setup scripts before its server command, run the full supported script; bypassing those steps can hide a failure in the actual startup workflow.

Make a reproduction another person can run: record the route, version, viewport, theme, input and shortest action sequence, then state **Expected Behavior** and **Observed Result** separately. Reduce one variable at a time while preserving the failing primitive's required structure. Keep the smallest useful regression case and report the checks actually performed, including any browser or assistive-technology coverage still missing.

## Find Your Next Reference

The starting point is now a **Working Application Boundary**, not just a copied screenshot. You know where styles enter, who owns a value, how the composition gets its routes and what happens when saving fails. Use the next steps to turn that understanding into a feature your team can ship, reuse and improve.

You do not need to complete the whole catalog. Pick the smallest next capability that makes a real task complete, finish its behavior, then return to the directory when another responsibility becomes clear. The focused guides remain the reference for detailed APIs; this page connects the decisions between them.

### What You Can Now Put Together

The chapters build on one another. **Setup Makes the Interface Available; Composition Makes It Useful; Integration Makes It Real.** Before choosing more components, take a moment to connect those responsibilities:

- **A Consistent Foundation.** Your `Preact` app loads one global stylesheet, `Tailwind CSS` discovers the classes you use, and semantic tokens keep related surfaces consistent. Return to [The Setup Check](#verify-one-surface-and-one-interaction) when a new screen looks different from the working baseline.
- **A Clear Component Contract.** Each control has a job, an accessible name and an identifiable state owner. You can explain which prop supplies its value and which callback reports a change. Use [Composition and State](#compose-behavior-before-extracting-an-abstraction) when those responsibilities become tangled.
- **An Application around the Interface.** Blocks provide a starting composition; your routes, records and services give it meaning. Forms connect input to validation, submission and recovery. Review [Block Boundaries](#replace-fixtures-at-clear-boundaries) or [Form Submission](#connect-submission-and-recovery) before replacing another demo callback.
- **Evidence that the Journey Works.** A finished feature includes narrow layouts, keyboard use, pending work and a usable failure path. The [Verification Walkthrough](#verify-the-whole-journey) turns those expectations into observable checks rather than a visual impression.

You do not need to memorize every API or install every companion package. The useful outcome is knowing **Which Layer to Change and Where to Find Its Contract**. Keep [Components](#components), [Blocks](#blocks), [Forms](#forms) and [Packages](#packages) as four entry points you can revisit independently.

> **If You Only Do One Thing Next:** choose one of the feature paths below and complete its first useful result. Read the later release and maintenance guidance when that result works. This chapter is a reference you can grow into, not a checklist you must finish before building.

### Build the Next Layer

Use this map at the moment you need to make a decision. The destination is intentionally more specific than the package name, so you can continue from the concept you have just learned.

| Next step                               | Detailed reference                                                                                                                                                               |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Choose an individual control            | [Component Selection](/docs/components#choose-components) and [Component Library](/docs/components#library-items)                                                                |
| Refine hierarchy and supported variants | [Component Styles](/blocks/styles#start-with-supported-variants-and-sizes) and [Density](/blocks/styles#adjust-density-as-a-system)                                              |
| Configure CSS and source discovery      | [CSS Setup](/docs/theming/css-setup#connect-tailwind-css-v4) and [Source Paths](/docs/theming/css-setup#make-source-detection-explicit)                                          |
| Customize shared colors, type and shape | [Token Overrides](/docs/theming/token-overrides#customize-a-preset-with-tokens) and [Typography & Motion](/docs/theming/token-overrides#refine-radius-typography-and-motion)     |
| Add preset and scheme controls          | [Theme Controls](/docs/theming/provider-controls#add-preset-and-scheme-controls) and [Runtime API](/docs/theming/api-reference)                                                  |
| Combine conditional utilities           | [`cn` Arrays and Objects](/docs/cn/installation#arrays-and-objects) and [Consumer Overrides](/docs/cn/installation#override-defaults)                                            |
| Adopt a complete layout                 | [Block Setup](/blocks/getting-started#bring-the-complete-source-into-your-app) and [Block Collections](/blocks#library-items)                                                    |
| Match the block to your app             | [Sidebar Tokens](/blocks/theming#understand-the-sidebar-token-family) and [Local Styling](/blocks/styles#use-semantic-colors-in-local-styling)                                   |
| Design a field group                    | [Form Design](/docs/forms#design-forms) and [Form Structure](/docs/forms#form-structure)                                                                                         |
| Compare form-state approaches           | [Native, Schema and Formisch Examples](/docs/forms#form-examples)                                                                                                                |
| Connect schema-driven controls          | [Formisch Anatomy](/docs/formisch/installation#anatomy), [Validation](/docs/formisch/installation#validation-modes) and [Array Fields](/docs/formisch/installation#array-fields) |
| Add a focused companion capability      | [Package Selection](/docs/packages#choose-packages) and [Integration](/docs/packages#package-integration)                                                                        |

### Choose One Complete Feature

Choose a feature with a **Clear Starting State, One Meaningful Result and a Recoverable Failure**. That gives you an end-to-end slice without requiring a complete product. These paths reuse the examples from earlier chapters while gradually introducing a new responsibility.

#### Write a Small Finish Line

Describe the next feature in the language of the person using it. “Add a dialog” names a component; “rename a workspace without leaving its settings” explains the task. Specify the existing record, the action, the confirmed result and what remains available if the request fails.

A short feature brief helps you keep that scope visible while you build:

```text next-feature.txt
Task: rename the current workspace
Start: an existing workspace with its saved name
Action: edit the name and choose Save changes
Success: show the confirmed name and find it again after returning
Recovery: keep the draft when saving fails and allow another attempt
First slice: one field, one route, one save operation
Later: additional settings after this journey works
```

Use your actual task and service behavior. The brief is complete when you can demonstrate each line, not when you have added a particular number of components. Keep the later ideas separate so they do not quietly expand the first slice.

#### A Workspace Settings Screen

Begin with [StarterPanel](#your-first-working-screen), then replace its preview message with a real preference draft and save boundary. Add a labeled workspace name using [Input](/docs/input/installation) and [Form Structure](/docs/forms#form-structure). Derive whether the draft differs from the saved record instead of maintaining another independently updated flag.

Next, connect the route's record to `onSave`, preserve the draft on failure and decide what Reset means: restore the last confirmed save, reload the newest server version or deliberately discard changes. Add a schema only when shared rules justify it; [Formisch](#use-formisch-for-coordinated-form-state) becomes useful when several fields need coordinated validation and submission.

**A Useful Completion Point:** the screen loads an existing value, saves a change, reports failure without losing input and shows the confirmed value after revisiting. Test that sequence with a keyboard and a narrow viewport before adding more preferences. Appearance controls should use the shared theme owner rather than another storage mechanism inside the form.

**Then Grow It Deliberately:** add one preference with a different interaction, such as a labeled `Switch`, and verify that Reset restores both values consistently. This reveals whether the draft model is coherent before the screen becomes a large settings form. Use [Field Choice](/docs/forms#design-forms) to choose the control rather than making every preference another text input.

#### A Navigable Project Workspace

Start with [Sidebar 01](/blocks/sidebar/sidebar-01#sidebar-01-usage-model) or [Application Shell 1](/blocks/application-shell/application-shell-1), depending on the frame you need. Replace sample destinations with a short list of real routes. Keep the current location correct on subpages, give each route a useful heading and leave data fetching at a clear application boundary.

Introduce one list and one detail screen before adding dashboards. A [Card](/docs/card/installation) can summarize a record; a [Dialog](/docs/dialog/installation) can host a focused action when leaving the page would interrupt the task. Use a clear empty state when no projects exist, a different explanation when a filter finds no matches, and a recoverable error when the request fails. These states should not all share the same blank placeholder.

**A Useful Completion Point:** direct URLs, refresh and Back work, the mobile menu closes after navigation, and a delayed response for the previous project cannot replace the current one. Verify authorization through the service and route boundaries; hiding a navigation item is only presentation. Continue with [Block Integration](/blocks/getting-started#replace-navigation-data-and-demo-behavior) and [Component Feedback](/docs/components#component-feedback).

**Then Grow It Deliberately:** add search or filtering to the list and decide whether that state belongs in the URL. A shareable result usually needs a different lifetime from an open menu. Preserve the active record and navigation context when returning from its detail screen; use [Navigation and Responsive Behavior](#connect-navigation-and-responsive-behavior) as the reference for the surrounding shell.

#### An Invitation or Account Flow

Begin with the [Native Form](#build-a-small-native-form-first) for a focused email task, or inspect [Login](/blocks/login) and [Signup](/blocks/signup) when the surrounding authentication layout is useful. Decide what completion actually means: invitation sent, verification required, or a session established. Use that outcome in the action label and confirmation.

Keep email formatting feedback separate from a server rejection or unavailable service. A successful visual demo is not evidence that authentication is connected. Return the actual service promise, handle retries according to its write policy and let the application's session layer own authenticated identity.

**A Useful Completion Point:** a person can submit through the button or Enter, understand a rejected request, correct or retry it and reach the intended next screen. Use [Submission Recovery](/docs/forms#form-recovery) and the [Formisch Control Integrations](/docs/formisch/installation#input) as the implementation grows. Add localization to visible labels, accessible names and error messages together rather than translating only the page title.

**Then Grow It Deliberately:** add the next genuine outcome, such as a verification step or a resend action. Explain whether the person should wait, edit the address or continue elsewhere. Keep each action tied to the service response instead of using an arbitrary timer as proof that the operation succeeded.

### Connect Real Data in Small Steps

#### Establish the Read and Write Boundaries

Keep fixtures until the original interaction is reliable, then replace one boundary with the real service. Begin with the read path: **Which Record Is This, Who Can Read It and What Happens When It Is Missing?** Pass a stable identity into the feature and validate the response fields you actually consume.

Next connect the write path. Define the submitted snapshot, the promise representing the operation and the meaning of a failed response. Keep success tied to confirmation from the service. If the backend normalizes a value, use that response as the new saved baseline while respecting any newer draft. If another person can edit the same record, decide how revisions and conflicts are surfaced before quietly overwriting their changes.

#### Exercise the Uncomfortable Transitions

Finally, revisit the feature's lifecycle. Change records while loading, navigate away during a request and try a retry after a timeout. Identify which work belongs to the component and which can outlive it in the data layer. A server write, cached record and open dialog have different lifetimes even when one click started them together.

**Keep the Adapter Small.** The reusable form should describe its input and `onSave` contract; the route can supply your API client, authorization context and navigation after completion. That separation makes a visual redesign or service replacement easier to verify without introducing a second state owner. Return to [State Ownership](#give-state-one-owner), [Submission](#connect-submission-and-recovery) and [Request Lifetimes](#keep-rendering-and-work-predictable) as needed.

Use a small, repeatable set of inputs while integrating: **An Existing Record, a Missing Record, a Delayed Response and a Rejected Save**. Add a long label or message so the layout is tested by the same scenarios as the behavior. Your fixtures should help you reproduce a state on demand, not make every request appear successful.

When a save succeeds, inspect the next visit as well as the confirmation. Did the saved record update? Does the draft now match the confirmed response? Can a person make another change immediately? These checks connect the visible success message to the state the rest of the application actually uses.

### Make a Repeated Pattern Worth Reusing

Build a second real use before deciding what the two instances should share. A wrapper is useful when it captures a **Stable Product Decision**: label/hint/error relationships, a named surface treatment or the same action contract. Similar-looking nested markup alone is a weaker reason for another abstraction.

Separate three kinds of change. A feature's arrangement belongs in its composition; a supported intent or density belongs in `variant` and `size`; a repeated palette or shape belongs in shared tokens. Use [`cn`](/docs/cn/installation#integration-styling) when those class sources meet, retaining consumer overrides where the contract allows them. Check the result inside its actual form, overlay and narrow container, including focused and disabled states.

Add companion packages only when the second use reveals a real responsibility. [Hooks](#hooks) can share repeated behavior, [Signals](#signals) can persist a small preference, [State](#state) can organize domain transitions and [i18n](#i18n) can carry user-facing language consistently. Keep the original source of truth identifiable after introducing any of them. Reusing an icon family is usually helpful; persisting every local toggle usually is not.

Record the decisions that a caller cannot infer from the prop names: whether a callback reports intent or returns completed work, whether changing a record resets a draft, and which styles can be overridden. A small documented contract is more useful than exposing every internal option as another boolean.

#### Extract a Decision, Then Prove It Twice

Give the shared piece a name that describes its responsibility, such as a contact field group or a settings section. Keep feature-specific loading and routing outside it unless those are explicitly part of its contract. A caller should be able to use the piece without knowing how another screen fetches its records.

Try the extraction in both original places before introducing further options. Change the label, supply a longer description and render an error. If each caller needs a different collection of escape hatches, the common boundary may be smaller than the initial wrapper. The [Component Styles Guide](/blocks/styles#start-with-supported-variants-and-sizes) and [`cn` Override Rules](/docs/cn/installation#override-defaults) help separate layout flexibility from a consistent visual decision.

**A Useful Reuse Check:** fix one shared behavior and confirm that both screens improve without losing their distinct task descriptions. This is stronger evidence of a useful abstraction than reducing the number of lines in either file.

### Prepare a Deliberate Release

#### Verify the Built Journey

Run the project's supported **Typecheck, Tests and Production Build**, including any route or asset generation those commands perform. Open the resulting preview through a direct nested URL, then repeat the task after client-side navigation. Check assets and links with the intended deployment base path instead of assuming the development root describes the deployed environment.

Use [The Verification Walkthrough](#verify-the-whole-journey) with the real content that is most likely to break the layout: a long workspace name, translated action, empty result, field error and slow request. Check both themes and the actual component's narrowest container. Review one neighboring feature that shares the changed primitive or styling rule; shared code expands the effect of a change.

Keep the evidence precise. A typecheck establishes type compatibility, a browser journey establishes that tested interaction, and a visual review establishes the inspected layout. Note any browser, assistive technology or service scenario you could not exercise. This makes the handoff useful without claiming that one automated result proves everything.

Before shipping, remove placeholder destinations and demo-only confirmations, preserve applicable source notices and make failures actionable without exposing stack traces or private response data. For an unresolved integration problem, prepare a small reproduction with the installed versions and the first relevant error. Use the [UI Repository](https://github.com/kamod-ch/kamod-ui) for the component source and the relevant [Companion Repository](#packages) for a package-specific contract.

#### Review It as the Next Person Will Use It

Start from the feature's actual entry point with no knowledge of its implementation. The heading should explain where you are; labels should explain what is expected; the primary action should explain what happens next. Follow the journey once using the keyboard, then repeat it with a narrow viewport and the longest realistic content you expect.

Review **Waiting, Completion and Recovery** as separate moments. During a request, it should be clear what is still in progress. After success, the confirmed result should be visible or the next destination understandable. After failure, the person should know what remains saved, what they can change and how to try again. Revisit [Feedback Timing](/docs/forms#validation-timing) and [Submission Recovery](/docs/forms#form-recovery) when those messages compete.

If someone else can review the feature, give them the task rather than a sequence of clicks. Observe where they hesitate or look for feedback. A small change to a label, field grouping or confirmation can be more useful than adding another component. Turn a repeatable misunderstanding into a concrete follow-up with the screen, state and expected explanation attached.

#### Leave a Useful Release Note

Record the user-visible change, the boundaries you connected and the checks you actually performed. Include known limitations precisely: “saving is connected, but invitations are still a preview” is more useful than “mostly complete.” Keep implementation detail only when it helps the next person test, maintain or extend the feature.

For changes to shared tokens or copied blocks, inspect more than the screen that motivated the change. A common `--primary` value, sidebar treatment or field wrapper may affect several routes. Keep the previous working version identifiable so an unintended regression can be compared and reversed without guessing which local override mattered.

### Keep a Small Working Baseline

Keep one easy-to-run screen that proves the shared setup: a themed surface, a labeled controlled input, a real route and a save with failure/retry feedback. This is your comparison when a later upgrade, copied block or token change behaves differently. It should use the same stylesheet and application entry as the feature it protects.

#### Return to the Same Reference after a Change

For installed dependencies, compare release notes and public exports before upgrading. For copied blocks, record the source revision and the local changes you intentionally made, then compare upstream behavior and types as well as appearance. A focus fix or changed helper signature can matter more than a padding adjustment. Retain the focused regression case next to the behavior it explains.

#### Hand over the Reasoning, Too

A short handoff can capture the feature's boundaries without copying the whole implementation:

```text feature-handoff.txt
Task: update workspace contact details
Entry: the application's workspace settings route
Styles: one global theme entry; local layout uses semantic tokens
Owner: form draft in the feature; saved record in the data layer
Save: the route supplies onSave and handles the confirmed response
Recovery: rejected writes preserve input and expose a usable retry
Evidence: typecheck, production preview, keyboard and narrow-screen journey
Next: reuse the field pattern only when the second screen needs it
```

Replace these examples with the actual route, ownership and evidence in your app. Keep versions in the manifest/lockfile and commands in `package.json`; the note explains why those boundaries exist. When improving performance, retain a representative dataset and compare the same interaction before and after, preserving keyboard behavior and recovery as part of the result.

### Plan the Next Iteration without Expanding Everything

Once the first journey works, choose the next improvement from evidence. You might discover an unclear error message, a repeated field pattern or a genuine need for another package. Treat these as separate decisions rather than automatically adding all three to the next screen.

#### Improve the Journey You Already Have

Start with the point where the person has to think hardest. Perhaps Save succeeds but the confirmed value is hard to find, an empty result offers no next action, or a long label hides an important control on mobile. Write the problem as an observable experience, make one focused change and repeat the same journey to assess it.

Use [Component Feedback](/docs/components#component-feedback) for communicating state, [Responsive Layout](#design-for-the-available-space) for crowded content, and [Accessible Interaction](#preserve-accessible-interaction) for names, focus and keyboard behavior. This work often improves the feature more than broadening its scope.

#### Add One Capability with an Identifiable Owner

Choose a companion package when you can name the responsibility it takes on. Use [Icons](#icons) to make repeated actions recognizable, [Hooks](#hooks) for shared behavior, or [Signals](#signals) for an appropriate persistent preference. Consider [State](#state) when domain transitions need coordination, and [i18n](#i18n) when labels, messages and formatting need to change together.

Write down what remains outside that package. Persisting an appearance preference does not make a cached server record authoritative; adding animation does not define when saving is complete. Keep the application's existing ownership model clear as you introduce another tool. The [Package Integration Guide](/docs/packages#package-integration) is the next reference once that boundary is explicit.

#### Keep a Small, Useful Follow-up List

Group future work by the result it improves instead of by the component it uses:

- **Clarity:** a better label, a more useful empty state or a confirmation tied to the saved value.
- **Reliability:** a reproducible failure, a stale response to ignore or a reset behavior to make consistent.
- **Reach:** a narrow-screen adjustment, keyboard improvement or translated message that helps more people complete the task.
- **Reuse:** a decision that has now appeared in a second feature and deserves a shared implementation.

Pick one item with a visible completion point. Keep speculative enhancements separate until a real task needs them. A short list that explains _why the next change matters_ is easier to act on than a long inventory of components you could add.

### Leave with a Clear Next Move

You are ready to extend the application when you can explain **Where the Data Lives, What an Action Promises, How the Person Recovers and Which Layer Owns the Appearance**. You do not need to remember every section of this guide; you need a reliable way to return to the right one.

Choose the continuation that matches the state of your project:

- **The App Is Still New:** return to [Your First Working Screen](#your-first-working-screen), confirm its styles and interaction, then choose [One Complete Feature](#choose-one-complete-feature).
- **The Screen Looks Right but Is Still a Demo:** follow [Real Data Integration](#connect-real-data-in-small-steps), give the values and service work clear owners, and finish the failure path alongside the successful one.
- **The Feature Works Locally:** use [The Verification Walkthrough](#verify-the-whole-journey) and [Release Review](#prepare-a-deliberate-release) to check the built experience, direct routes and repeat visits.
- **The First Feature Is Already in Use:** keep its [Working Baseline](#keep-a-small-working-baseline), choose one [Next Iteration](#plan-the-next-iteration-without-expanding-everything), and extract only the decisions that have actually started to repeat.

For detailed implementation, keep the [Component Library](/docs/components), [Block Collections](/blocks), [Forms Guide](/docs/forms) and [Package Directory](/docs/packages) close by. The [Reference Map](#build-the-next-layer) takes you directly to setup, styling, composition and integration topics when the next question is more specific.

> **Your Next Useful Result:** one person can enter the feature, understand the task, complete it and recover when something goes wrong. Build that journey, keep the evidence that it works, and let the next real need guide what you add afterward.
