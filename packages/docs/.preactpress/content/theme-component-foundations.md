## Choose your theme foundation

**Choose a brand preset and an appearance scheme separately.** Ocean, for example, works in Light or Dark; System follows the device. Static CSS needs no provider. Add runtime controls only when users need a saved choice.

```bash package-manager
pnpm add @kamod-ch/ui @kamod-ch/themes @preact/signals
```

Keep your existing Preact and Tailwind setup. For this guide, use the complete `@kamod-ch/themes/theme.css` foundation: it includes the application presets and sidebar roles. [CSS setup](#css-setup) covers the import order and source scanning; [Getting Started](/docs/getting-started#set-up-your-app) covers a first installation.

## Style components through their roles

Use the component’s supported `variant` and `size`, local utilities for layout, and **semantic colors for shared design decisions**. A surface and its text need an explicit pair:

```tsx src/components/ProjectSummary.tsx
import { Button } from "@kamod-ch/ui/button";

export function ProjectSummary() {
  return (
    <section class="rounded-lg border border-border bg-card p-4 text-card-foreground">
      <h2 class="font-semibold">Your next workspace</h2>
      <p class="mt-2 text-sm text-muted-foreground">A shared palette, applied by role.</p>
      <Button type="button" variant="outline" class="mt-4">
        View projects
      </Button>
    </section>
  );
}
```

`bg-card` supplies the surface; `text-card-foreground` supplies its ink. Components choose their own combinations: the default Button uses `text-background`, so changing `--primary-foreground` alone will not change that label.

| Change                       | Where it belongs                                       |
| ---------------------------- | ------------------------------------------------------ |
| Spacing and arrangement      | Parent layout, such as `grid gap-4`                    |
| Supported control treatment  | Component props, such as `variant="outline"`           |
| App-wide color or shape      | [Shared tokens](#token-overrides)                      |
| Copied navigation and shells | [Block theming](/blocks/theming)                       |
| Syntax colors in a reader    | [Code palettes](/docs/code/installation#syntax-themes) |
