## Choose your theme foundation

A theme is a **shared vocabulary for visual decisions**. Your application asks for a page surface, readable text, an important action or a quiet boundary; the selected palette supplies the values. A card can keep `bg-card text-card-foreground` while Ocean, Sunset or a custom brand changes what those roles look like.

Start with the [Getting Started Guide](/docs/getting-started#set-up-your-app) if you have not rendered your first component yet. This reference explains the decisions behind that setup, including where values come from, which stylesheet owns them and how they reach components. It is the same foundation used by [Complete Blocks](/blocks/theming), forms and ordinary controls.

### Separate the four appearance decisions

| Decision            | What it answers                                          | What it does not do                                      |
| ------------------- | -------------------------------------------------------- | -------------------------------------------------------- |
| CSS foundation      | Which semantic roles and utilities are available?        | It does not remember a user's preference.                |
| Brand preset        | Which colors, typography and shape express your product? | It does not decide whether the device prefers dark mode. |
| Appearance scheme   | Which light or dark values should the interface use?     | It does not select a different product brand.            |
| Component treatment | Which variant, size and local layout fit this action?    | It should not redefine the whole palette.                |

**A preset and a scheme are separate choices.** Ocean can be light or dark. System is a preference that resolves to one of those schemes; it is not a ninth brand preset. A page can use one preset without exposing a picker, and it can support dark mode without installing a state library just for appearance.

Syntax colors are a further, smaller concern. [Code](/docs/code/installation#syntax-themes) can use a familiar fixed Prism palette or borrow the surrounding application's tokens. Changing a source palette does not change the page's theme, choose a language or rewrite the copied source.

### Install the packages you need

Add missing dependencies to the Preact application you already have. The full theme is useful when ordinary components and copied sidebars must share the complete token contract.

```bash package-manager
pnpm add @kamod-ch/ui @kamod-ch/themes @preact/signals
```

`@kamod-ch/ui` supplies components and their component styles. `@kamod-ch/themes` supplies the full semantic mappings and brand values; its optional runtime can coordinate appearance preferences. `@preact/signals` satisfies the runtime's peer contract. Preserve your existing Preact, Tailwind and Vite setup rather than replacing the application's entrypoints to follow this example.

**Loading CSS and managing preferences are different jobs.** Static theme CSS works without a `ThemeProvider`. Add a provider or the documented runtime helpers when your application actually needs a shared selectable preference, persistence or System mode. Those APIs are explained once in [Manage Appearance Preferences](/docs/theming/provider-controls), including server rendering and the initialization script.

### Pick one owner for the global foundation

For a complete app, start with `@kamod-ch/themes/theme.css`; use the smaller `@kamod-ch/ui/theme.css` deliberately when you own the missing preset/sidebar mappings yourself. The [theme-entry comparison](/docs/theming/css-setup#choose-a-theme-entry) explains the exact differences. Importing both does not combine two independent features: it places overlapping default declarations into the cascade.

```css src/app.css
@import "tailwindcss";
@import "@kamod-ch/themes/theme.css";

/* Product overrides follow the selected foundation. */
:root[data-theme="ocean"] {
  --radius: 0.75rem;
}
```

Import this stylesheet from your application entry once. A copied card, dialog or shell should consume that foundation, not import its own copy of Tailwind. A library stylesheet that defines styles is also different from Tailwind's source scanning: follow [Source Detection](/docs/theming/css-setup#make-source-detection-explicit) when installed component utilities are missing.

### Decide how wide the theme should reach

The root theme normally belongs to the document, so navigation, page content and overlays agree. A local theme belongs on a deliberate container, such as a preview, an embedded tool or a palette comparison. The full theme's `data-theme-scope` resets its semantic values before applying the selected preset.

```tsx src/components/ThemeStudy.tsx
export function ThemeStudy() {
  return (
    <section data-theme-scope="" data-theme="ocean" class="dark">
      <div class="rounded-lg bg-card p-4 text-card-foreground">
        A local Ocean surface; the rest of the document keeps its theme.
      </div>
    </section>
  );
}
```

Set an explicit local scheme when comparing light and dark. **A CSS variable follows DOM ancestry, not component ownership.** A dialog portalled to `document.body` can sit outside a local scope even if its trigger is inside it. Keep the document theme as the normal app boundary, or arrange portal placement and scope intentionally; a `z-index` change cannot fix a missing inherited token.

Use the [preset studies](/docs/theming/installation#color-theme-presets) for brand character and the [runtime reference](/docs/theming/api-reference) for state ownership. Neither a token override nor a local preview should silently start another storage listener or overwrite the user's global choice.

## Style components through their roles

Start with what the element **means**, then choose how it looks. A component's `variant` expresses a supported treatment; `size` expresses supported density; `class` handles local layout or a deliberate product-specific refinement. Semantic tokens let those choices continue working when the palette changes.

### Begin with the component contract

```tsx src/components/AccountActions.tsx
import { Button } from "@kamod-ch/ui/button";
import { ThemeToggle } from "@kamod-ch/ui/theme-toggle";

export function AccountActions() {
  return (
    <div class="flex flex-wrap items-center gap-3">
      <Button type="button">Save changes</Button>
      <Button type="button" variant="outline">
        Cancel
      </Button>
      <ThemeToggle />
    </div>
  );
}
```

The layout chooses the gap and wrapping. [Button](/docs/button/installation) chooses its supported interaction styling. [Theme Toggle](/docs/theme-toggle/installation) owns its accessible control behavior. Your application still owns saving, cancellation and whether changing appearance is relevant in this location.

Avoid rebuilding the default button's hover, focus, disabled and loading states merely to change its brand color. First inspect the existing variant and the tokens it consumes. Conversely, a component prop cannot define the spacing between unrelated siblings; use a local layout utility for that responsibility.

### Pair a surface with its intended text

```tsx src/components/ProjectSummary.tsx
export function ProjectSummary() {
  return (
    <section class="rounded-xl border border-border bg-card p-4 text-card-foreground">
      <h2 class="font-semibold">Your next workspace</h2>
      <p class="mt-2 text-sm text-muted-foreground">
        Shared colors keep this summary readable across presets.
      </p>
    </section>
  );
}
```

`bg-card` describes a content surface; `text-card-foreground` describes readable content on that surface. `text-muted-foreground` lowers supporting emphasis without making the whole card translucent. A parent `opacity` would fade borders, icons, children and focus feedback together, which is usually a different result.

**A foreground token is not automatically applied by its background token.** `bg-primary` does not also add `text-primary-foreground`. Components compose the classes they need. The current default Button, for example, uses `text-background`, so inspect its implementation before assuming that changing `--primary-foreground` changes that label.

### Keep local changes local

Choose the narrowest useful owner for each change:

| Change                                  | Best first owner       | Example                                |
| --------------------------------------- | ---------------------- | -------------------------------------- |
| Space between cards                     | Parent layout          | `grid gap-4`                           |
| A compact supported control             | Component API          | `size="sm"`                            |
| Brand emphasis throughout the app       | Shared theme token     | `--primary`                            |
| A quieter content region                | Semantic surface pair  | `bg-muted text-foreground`             |
| Only the navigation's selection surface | Sidebar token family   | `--sidebar-accent` with its foreground |
| Only a source reader's keyword          | Code-specific variable | `--kamod-code-keyword` on that reader  |

A large CSS selector targeting every descendant button tends to hide these boundaries. A small component class or token override makes the ownership visible and keeps sibling components free to use their documented variants.

### Treat states as a complete set

Review idle, hover, selected, selected-hover, focus-visible, disabled, pending and error states together. A selected background and a hover background can each look good separately but become indistinguishable when combined. A focus ring must remain visible on both the component's surface and the surface around it.

Do not use `--primary` as a general synonym for success, error or warning. Feedback has its own role tokens and should also have a label or icon. Chart series colors distinguish data; borrowing their hues for [theme-aware syntax](/docs/code/installation#code-theme-tokens) is a separate presentation choice, not a declaration that a number is a warning or a string is successful.

```css src/project-summary.css
.project-summary:focus-visible {
  outline: 2px solid var(--outline);
  outline-offset: 3px;
}
```

This example uses the focus token as an outline color. Tailwind's ring utilities and ordinary CSS `outline` are different mechanisms even when they draw from the same semantic value. Retain the component's existing keyboard behavior and accessible name when refining either.

### Follow a change through real content

A token is shared, so verify more than the component that motivated the change. Check a form field inside a card, a popover above that card, a navigation item beside it and a disabled action. Include long labels, validation messages, zoom and narrow containers; a pleasing isolated swatch does not prove an entire interface works.

For the value-to-utility chain, continue with [Theme Tokens Explained](/docs/theming/token-overrides#what-a-theme-token-actually-is). For copied layouts, use [Block Theming](/blocks/theming). For a code-only palette, use [Syntax Themes](/docs/code/installation#syntax-themes) rather than changing the application's `--primary` solely to recolor a keyword.
