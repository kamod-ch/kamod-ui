---
title: Block component styles
description: Customize Kamod block compositions, component variants, density, surfaces and responsive behavior while preserving accessibility and shared theme tokens.
pageKind: blocks-guide
slug: styles
sidebar: false
outline: false
---

## Separate composition, style and theme

For the application-wide context, start with [Style Your Interface](/docs/getting-started#style-your-interface). This guide goes deeper into **Local Composition, Hierarchy and Density** after the shared stylesheet is working.

A useful block has several layers of design. Its **Composition** decides where the navigation, header, form and page content live. Its **Component Styles** decide how individual controls express hierarchy and density. Its **Theme** supplies the shared colors, surfaces and shape tokens. Understanding that separation helps you make a precise change without restyling the entire screen.

For example, moving a workspace switcher from the footer to the top is a composition change. Making its trigger smaller is a component-style change. Changing the sidebar surface across the application is a theme change. All three are valid, but they belong in different places and have different effects on future maintenance.

Kamod blocks do not require a selection of external React primitive libraries or a shadcn registry style during installation. Use the Kamod components already present in the copied source, their documented props and your own local composition. The preset selector in this documentation changes appearance; it does not generate a different component implementation.

| Desired change                       | Start here                                        | Scope                              |
| ------------------------------------ | ------------------------------------------------- | ---------------------------------- |
| Move, add or remove a region         | The copied block’s JSX composition                | One block or a shared local layout |
| Change a control’s visual importance | Its supported `variant` prop                      | That control                       |
| Adjust control density               | Its supported `size` prop and surrounding spacing | A related group of controls        |
| Change brand colors or shared radius | Semantic CSS tokens                               | Every consumer in the theme scope  |
| Add a new interaction                | The existing primitive and the app’s callback     | The behavior you are integrating   |

## Read the existing structure first

Open the Code tab and follow the main file’s imports before editing. A sidebar variant can contain a provider, header, several navigation groups, a footer menu and a content inset. A form page can separate its visual framing from the form that owns validation and submission. The shorter outer file is often a map of the composition, not the whole implementation.

Identify the owner of each visual region. Change navigation-row spacing in its navigation helper, form-field spacing in the form, and page padding in the page content container. Applying the same correction in multiple unrelated parents usually means the first adjustment was made at the wrong level.

Keep the preview open as a reference while adapting the source. Preserve the parts that already solve a difficult interaction, such as a mobile sheet, dropdown focus handling or a collapsible group. You can change their content and presentation without replacing their behavior with a new custom implementation.

For the integration differences between sidebar compositions, configurable shells and authentication pages, read [Getting Started](/blocks/getting-started#render-the-block-in-an-existing-screen). For the precise API of an individual primitive, open the [Components Directory](/docs/components).

## Start with supported variants and sizes

Use a component’s API before adding a class override. A documented variant communicates intent to the next person reading your code and keeps the component’s focus, disabled and hover treatments together. Do not assume that every component accepts the same set of variant names; inspect its reference page.

The Button component, for example, supports distinct action treatments. A primary action can sit beside a quieter secondary action without custom color values:

```tsx src/components/ScreenActions.tsx
import { Button } from "@kamod-ch/ui";

export function ScreenActions() {
  return (
    <div class="flex flex-wrap items-center gap-2">
      <Button type="submit" size="sm">
        Save changes
      </Button>
      <Button type="button" variant="outline" size="sm">
        Cancel
      </Button>
    </div>
  );
}
```

This is a styling example; connect Cancel to your application’s actual behavior. Give non-submit buttons inside forms `type="button"` so a visual adjustment does not accidentally introduce an extra submit action. A link to another page should remain a link, even if it is styled as a button.

For an action that navigates, Button also supports `href`. Keep the destination real and use the app’s routing conventions where appropriate. A compact icon-only control needs an accessible name; its visual size does not replace that label.

```tsx src/components/HelpLink.tsx
import { Button } from "@kamod-ch/ui";
import { BookOpenIcon } from "@kamod-ch/icons/lucide";

export function HelpLink() {
  return (
    <Button href="/help" variant="ghost" size="icon" aria-label="Open help">
      <BookOpenIcon aria-hidden="true" />
    </Button>
  );
}
```

See the [Button API](/docs/button/api-reference) for the current variant and size options. Use the exact icon export supported by your installed `@kamod-ch/icons` version, and keep a consistent icon family and stroke treatment within a control group.

## Establish a clear visual hierarchy

Choose one primary action for a region, then give supporting actions a quieter treatment. A page with several equally prominent buttons makes the user decide which one matters before they can act. Secondary actions can remain visible without competing with the main task.

Apply the same principle to surfaces. The overall page, a content card and a temporary popover have different jobs. Use semantic backgrounds such as `bg-background`, `bg-card` and `bg-popover` so those relationships survive a preset or color-scheme change. Pair each surface with its corresponding foreground token where needed.

Borders and separators should explain structure. Use a divider where a toolbar ends and content begins, or between navigation and page content. Avoid enclosing every sentence in a separate card: extra borders can make a simple composition harder to scan. A heading, a small amount of supporting text and deliberate spacing often provide enough separation.

Use muted text for descriptions and supporting metadata, not for information the user must struggle to read. Keep required labels and important status messages legible in both schemes. A softer color is a hierarchy choice, not permission to sacrifice contrast.

## Adjust density as a system

A compact application benefits from consistent spacing more than from making every control as small as possible. Start with a small set of gaps and paddings, then use them throughout a region. For example, keep field label-to-control spacing tight, field-to-field spacing larger, and section-to-section spacing larger again.

Change related controls together. If you reduce a toolbar’s button size, check its select trigger, icon buttons, separators and surrounding padding at the same time. Baselines and hit targets should remain coherent. Use wrapping or a deliberate second row before squeezing labels into unreadable fragments.

```tsx src/components/PageSection.tsx
import type { ComponentChildren } from "preact";

export function PageSection({ children }: { children: ComponentChildren }) {
  return <section class="min-w-0 space-y-6 p-4 sm:p-6">{children}</section>;
}
```

This wrapper establishes page-region spacing; it does not replace the block’s existing sidebar provider or layout container. Insert it only where a content section belongs. If the parent already supplies the same padding, adjust the existing wrapper rather than stacking two identical layers.

Use actual content when judging density. A navigation item with a long translated label, a form field with a two-line error and a toolbar with a loading state all need more room than the shortest demo data. Preserve sufficient room for keyboard focus indicators and touch interaction.

## Use semantic colors in local styling

Semantic utilities express why a color is used. `text-muted-foreground` means supporting text; `border-border` means a structural boundary. Hard-coded gray values may look correct in one preview and become too bright or too dim in another preset.

A local summary can use the application’s surface and foreground contract directly:

```tsx src/components/WorkspaceSummary.tsx
export function WorkspaceSummary() {
  return (
    <div class="rounded-lg border border-border bg-card p-4 text-card-foreground">
      <p class="font-medium">Workspace overview</p>
      <p class="mt-1 text-sm text-muted-foreground">
        Review recent activity before choosing your next task.
      </p>
    </div>
  );
}
```

Use a brand accent sparingly for emphasis, selection or a meaningful action. Do not use color as the only indication of selection, errors or availability. A current navigation item can also have an appropriate `aria-current`, while an error should include readable text connected to the relevant field.

If the same color change is needed in several blocks, move it to the [Theme Layer](/blocks/theming#customize-a-preset-with-tokens). If it applies only to a specific region, keep it local and document why that region differs. Avoid repeated arbitrary color values that slowly create a second theme system.

## Adapt navigation without losing behavior

Sidebar variants deliberately demonstrate different compositions. Some emphasize grouped destinations; others add nested menus, collapsible sections, a compact rail or a floating surface. Select the structure closest to your application before changing its visual details.

When editing the copied sidebar, preserve the relationships between the provider, sidebar, trigger and content area. Their coordination affects desktop collapse and mobile behavior. A width or positioning class can change more than appearance if it interferes with the structure that controls the sidebar’s state.

For active navigation, derive the current item from your route or selection model. Do not permanently mark the first demo link active after connecting real destinations. Keep the exact helper’s data shape and supported navigation integration; different helpers may expose different customization points.

A useful customization sequence is to replace labels and destinations, review group ordering, adjust row density, then refine separators or surfaces. Check expanded, collapsed and mobile modes after each structural change. A label that disappears in a collapsed rail still needs an accessible way to identify the action.

## Keep responsive intent explicit

A desktop layout is not a smaller mobile layout. On narrow screens, navigation may become a sheet, toolbars may wrap, and supporting content may move below the primary task. Preserve the core task first and decide deliberately which secondary content can be rearranged.

Use `min-w-0` on flex and grid children that must shrink. Let code, wide tables or dense data regions scroll within their own containers instead of forcing the entire document wider than the viewport. Avoid fixed widths on ordinary text regions when a max-width or flexible column would work.

```tsx src/components/ContentColumns.tsx
import type { ComponentChildren } from "preact";

export function ContentColumns({
  main,
  aside,
}: {
  main: ComponentChildren;
  aside: ComponentChildren;
}) {
  return (
    <div class="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div class="min-w-0">{main}</div>
      <aside class="min-w-0">{aside}</aside>
    </div>
  );
}
```

Here the content stacks until the large breakpoint, then gains a supporting column. Use the breakpoint that fits your actual content. The showcase’s viewport buttons are convenient samples, not a replacement for resizing the integrated page between those widths or testing your app’s surrounding chrome.

## Preserve interaction states

Review default, hover, focus-visible, active, disabled, pending and error states as a set. A control is not finished when its resting appearance looks good. Removing an outline, replacing a button with a clickable span or hiding all labels can improve a screenshot while making the interface harder to use.

Use the existing Kamod primitives for menus, dialogs, sheets and collapsibles. Their behavior includes more than showing and hiding content. When you change a trigger or move an overlay, verify keyboard operation, dismissal and focus return instead of duplicating those responsibilities in ad hoc event handlers.

Keep loading feedback close to the action that started it. Reserve enough room for status labels or use a stable label with a changing icon so the toolbar does not jump. Disable repeated submission only while the operation requires it, and provide a readable error path when the request fails.

Respect reduced-motion preferences when adding transitions. Prefer short opacity or color transitions for subtle feedback, and do not make movement necessary to understand state. Check that custom animation does not continue after a component unmounts; effect listeners, observers and timers should have matching cleanup.

## Extract useful local patterns

Repeated presentation can become a small local component, especially when it carries a clear meaning such as a page toolbar, account summary or section heading. Keep its props close to that meaning. A helper that only renames a single utility class may add indirection without reducing complexity.

Separate application services from visual helpers. A navigation row can accept a destination or supported callback without importing a particular router throughout the component tree. A form can receive an async submission function without becoming responsible for your entire authentication architecture.

When several copied variants share similar markup, first check whether they need to evolve together. Sharing a narrow helper can be useful; putting unrelated variants behind one large conditional shell often makes each composition harder to understand. Explicit local JSX is a valid design when the layouts are intentionally different.

Comment on a non-obvious layout constraint or integration decision, rather than narrating every class. For example, explain why a content region must own its scroll container or why an overlay portal cannot be clipped by its parent. Keep the source approachable for the next person adapting it.

## Review the finished treatment

| Area                | Review question                                                                |
| ------------------- | ------------------------------------------------------------------------------ |
| Hierarchy           | Is the primary task clear without every control using the strongest treatment? |
| Spacing             | Do related elements sit together, with enough separation between sections?     |
| Theme               | Are surfaces, text, borders and status colors readable in light and dark mode? |
| Content             | Do long labels, empty states and validation messages fit without overlap?      |
| Responsive behavior | Can the user navigate and finish the main task at narrow and wide widths?      |
| Accessibility       | Are names, labels, focus indicators and keyboard interactions preserved?       |
| Maintainability     | Does each change live in the component or token layer that owns it?            |

Compare the adapted screen with the original preview to understand intentional differences, then judge it with your real content and workflow. The goal is a coherent application, not an exact screenshot match after its requirements have changed.

Return to [Getting Started](/blocks/getting-started#verify-the-first-real-render) for integration checks, or continue to [Theming & Tailwind](/docs/theming/installation) when the change should apply across every block. The [Component References](/docs/components) remain the authority for individual variants, props and interaction contracts.
