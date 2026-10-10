---
title: Getting started with blocks
description: Copy and integrate Kamod UI blocks into a Preact application, with dependencies, local imports, routing, validation and troubleshooting.
pageKind: blocks-guide
slug: getting-started
sidebar: false
outline: false
---

## Understand what you are adding

New to Kamod UI itself? Complete the [First Working Screen](/docs/getting-started#your-first-working-screen) in the **Getting Started Guide**, then use this page to bring a complete block into that foundation.

A Kamod block is a **Complete, Editable Composition** built from Kamod UI components. A component gives you a control such as a button, sheet or sidebar primitive. A block arranges those controls into a useful screen: grouped navigation, an application frame, a login form or a registration page. You start with a working layout and then make its content and behavior belong to your application.

The source is the integration contract. Read the variant’s **About This Block**, **Usage**, and **Props and Data** sections alongside its preview. Two blocks that look similar can accept data in different places. Do not assume that every page export forwards props to the components inside it.

The blocks package in this repository is private. Paths such as `@kamod-ch/blocks/sidebar/sidebar-05` identify repository source; they are **Not Published Installation Commands**. The supported documentation workflow is to copy the supplied files into your app and use local imports. You do not need a shadcn registry, `components.json`, a Pro key or a React compatibility layer for these Kamod examples.

| Starting point    | What you change                                                               | Where to read next                                                   |
| ----------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Sidebar           | Edit the local composition, navigation data and inner helper props.           | [Sidebar Collection](/blocks/sidebar)                                |
| Application Shell | Pass typed navigation, breadcrumbs, user data and page content to the shell.  | [Application Shell 1](/blocks/application-shell/application-shell-1) |
| Login or signup   | Connect the inner form’s supported callbacks and replace the page’s branding. | [Login](/blocks/login) and [Signup](/blocks/signup)                  |

## Choose a variant before copying

Start in the [Blocks Directory](/blocks) and open a published collection. Planned collections describe future categories; they do not yet provide source or installation pages. Compare the actual navigation structure, content area and interaction model of the available variants rather than choosing only by thumbnail.

In a detail page’s **Preview** tab, try the interactions your users will need. Open nested navigation, collapse a sidebar where supported, and inspect the mobile drawer. Change the preview’s screen size, color scheme and preset to see whether the composition suits your content. Larger screen controls are disabled when the available showcase width cannot fit them. Open the preview in its own tab when you need more room.

The **Code** tab lets you inspect the composition and supporting files separately. Follow the imports: a short page component often depends on a more substantial form or navigation helper. The **Prompt** tab offers setup and adaptation instructions for a coding assistant; it does not install anything by itself. Your app still owns the resulting files and integration decisions.

Before moving on, identify the part you intend to keep and the part you intend to replace. For example, keep the sidebar/header/content arrangement while replacing its demo links, organization names and placeholder page. This small decision prevents unnecessary rewrites during setup.

## Check your project foundation

Use a **Preact and TypeScript** application with Tailwind CSS v4. Keep its existing package manager, bundler and directory conventions. The examples below use `pnpm`, Vite and a `src` directory; adjust those paths to your project instead of creating a second app entry or stylesheet.

Check `package.json` first. If Preact, Kamod UI or Tailwind is already configured, reuse that setup. Install only missing dependencies, and consult the chosen block’s dependency list for the full requirements. Some authentication variants need form and validation packages that a sidebar does not use. Copying the TSX alone will not supply those packages.

For a typical sidebar foundation, the packages used by these guides are:

```bash
pnpm add preact @kamod-ch/ui @kamod-ch/icons @kamod-ch/themes @preact/signals
```

For a Vite project that does not yet process Tailwind CSS v4:

```bash
pnpm add -D tailwindcss @tailwindcss/vite
```

Add the Tailwind plugin alongside your existing Preact plugin. This example assumes your Vite project already has `vite` and `@preact/preset-vite`; install them if you are creating that foundation yourself. Preserve any existing aliases and plugins.

```tsx vite.config.ts
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [preact(), tailwindcss()],
});
```

Kamod uses Preact’s types, hooks and rendering. If your app is React-only, importing a block is not a framework migration. Decide on a Preact integration first; adding `react`, `react-dom` or React-only shadcn primitives to resolve individual errors changes the assumptions of the supplied source.

## Bring the complete source into your app

Open the variant’s setup section and follow its **Destination Paths**. The Code tab may show a friendly source label such as `app/login/page.tsx`; that label does not mean your project needs a Next.js app directory. Use the installation paths documented for that particular variant.

Sidebar pages offer a source ZIP. Extract its variant folder into `src/components/blocks/`, keeping the internal structure intact. The archive includes source and license information, but dependencies are installed separately. Other variants list the files to copy manually. Keep supporting components, data modules and any referenced assets together; a successful download of the main file is not a complete installation.

A sidebar destination commonly looks like this. The exact helpers and data files vary by variant; use its included-files list as the authority.

```text
src/
  components/
    blocks/
      sidebar-05/
        index.ts
        sidebar-05.tsx
        components/
        data/
```

Preserve relative imports when you move the folder. If you rename a helper, update every import that refers to it. If your project uses aliases, configure the same resolution in TypeScript and your bundler before replacing relative paths. An alias that works only in the editor can still fail in the browser build.

Some illustrated or branded variants use SVG imports ending in `?url`. Vite handles these as asset URLs. Keep the referenced files and Vite client types, or adapt the import to your bundler’s asset handling. Retain the supplied license notices when copying and modifying source; the design reference on a detail page is separate from the implementation you are installing.

## Connect the global stylesheet

Import Tailwind first and Kamod’s full theme entry after it. The full theme provides the semantic and sidebar tokens used throughout these block examples. Import the stylesheet once from your app entry; do not duplicate the theme import in every copied block.

```css src/app.css
@import "tailwindcss";
@import "@kamod-ch/themes/theme.css";

/* Relative to this stylesheet in src/. */
@source "../node_modules/@kamod-ch/ui/dist/**/*.{js,mjs}";
```

The `@source` path above assumes dependencies are in the project-root `node_modules` directory. Verify the installed package layout if yours differs. Tailwind normally detects your local `src` files; add an explicit source for copied code only when it lives outside the detected tree. Installing a package alone does not guarantee its class strings are scanned.

```tsx src/main.tsx
import { render } from "preact";
import { App } from "./App";
import "./app.css";

render(<App />, document.getElementById("app")!);
```

This entry example assumes your existing HTML mount element is `id="app"`. Reuse your own mount or hydration entry in an established app. For presets, dark mode, source detection and first-render troubleshooting, continue with [Theming & Tailwind](/docs/theming/installation).

## Render the block in an existing screen

Start with the smallest integration that preserves the composition. For Sidebar 5, the folder’s `index.ts` exports the named `Sidebar05` component. From `src/App.tsx`, the local import is:

```tsx src/App.tsx
import { Sidebar05 } from "./components/blocks/sidebar-05";

export function App() {
  return <Sidebar05 />;
}
```

This renders the supplied demo composition. It does **Not** pass your routes or page content into it. Open `sidebar-05.tsx`, locate the existing content area, and replace its placeholder content there. Then edit the supplied data and the props passed to its inner helpers. Keep the surrounding provider, sidebar and inset structure while you learn which element owns each part of the layout.

Application Shell 1 follows a different approach: its reusable component exposes configuration props and `children`. It can wrap your own page without editing the shell’s internal composition for every route. Its [Typed Usage Examples](/blocks/application-shell/application-shell-1#application-shell-usage) show the required shape and callback contracts. Read those definitions rather than applying a guessed `items` or `content` prop to a sidebar wrapper.

For login and signup, the exported page composes a form with branding and optional illustration. Configure the inner form where it is rendered, or use that form directly if you already have a page layout. Follow the chosen form’s real props; the outer page is not necessarily a configurable forwarding wrapper.

## Replace navigation, data and demo behavior

Work from content toward behavior. Replace visible labels and sample records first, then map destinations to real routes, then connect actions. Keeping those steps separate makes it easier to tell a data-shape error from a router or service problem.

- **Navigation:** replace placeholder destinations, preserve stable item identifiers and use the app’s actual active-route logic. Connect client-side routing only through the supported callback or link integration for that helper.
- **Page Content:** put the real screen inside the intended content region. Avoid mounting another complete application shell inside a shell you already have unless the nested layout is deliberate.
- **Account Actions:** connect profile, settings and sign-out behavior to your application. A menu item with a demo callback is not an account service.
- **Forms:** wire supported submit/provider callbacks to your existing service, preserve pending and error feedback, and redirect only after the service confirms success.

Keep server authorization separate from navigation visibility. Hiding a link can simplify the interface, but it does not enforce access to a route or endpoint. Likewise, a successful demo form message does not create a user, authenticate a session or persist submitted data.

Use the detail page’s **Local Props and Data** and **Data Type Reference** sections when changing data structures. Required fields, optional callbacks and return types come from the source. Keep the intended async contract instead of discarding a returned promise merely to satisfy a UI handler.

## Use the setup prompt when it helps

The showcase’s **Set Up Block** prompt packages installation guidance and reference source for a coding assistant with access to your project. Copy the complete prompt so it includes supporting files, not just the opening task. The Plain, Code and Markdown views are different presentations of the same underlying prompt; the copy action supplies its source text.

Tell the assistant where the block should appear and which existing routes or services to use. Ask it to inspect `package.json`, the app entry, global CSS and current conventions before making changes. It should reuse your setup, preserve unrelated edits and report any integration gaps. No assistant-specific package is required to use the prompt.

Use **Adapt Block** after the initial integration when you have a defined change. Replace its bracketed fields with your content, layout goals and behavior requirements. Include the current local source if it has diverged from the original. An assistant cannot preserve edits it has not been shown, and a screenshot alone does not describe the component API.

Review the resulting diff and run your app’s checks. If the assistant cannot execute commands in your project, apply the changes and run them yourself; generated instructions are not evidence that the integration works.

## Verify the first real render

Check the integrated screen with representative data, not only the short demo labels. Long organization names, empty groups, validation messages and slow service responses often reveal problems that a static preview cannot.

| Check              | What to confirm                                                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| Styles             | Page, sidebar, borders and controls use the same theme. Missing utilities are fixed at source detection, not with scattered overrides. |
| Responsive layout  | At 320, 768, 1024 and 1440px, navigation remains reachable and content does not force the entire document to scroll horizontally.      |
| Keyboard           | Focus is visible, menus and dialogs can close, and focus returns to their trigger where appropriate.                                   |
| Data and routes    | Links go to real destinations, active items match the route, and empty data does not leave misleading controls.                        |
| Forms and services | Pending, error and success states reflect the real request, with no duplicate submission or invented authentication.                   |
| Production build   | Imports, assets and generated styles still resolve outside the development server.                                                     |

Run the typecheck, lint, tests and production build scripts that your project actually defines. Test interactions touched by your changes. A spacing adjustment does not require a test that asserts each class string, but a new navigation callback or submission contract deserves behavior coverage.

## Troubleshoot common setup problems

### The block renders but looks unstyled

Confirm that the global stylesheet is loaded by the app entry, Tailwind is processing it, and the Kamod theme import follows Tailwind. Inspect whether a missing utility comes from your local block or the installed UI package, then correct the corresponding source path. Check the production CSS as well as development output.

### The import path cannot be resolved

Compare the actual copied folder with the variant’s destination list. Check filename casing, barrel exports and shared helpers before changing package dependencies. A repository `@kamod-ch/blocks/...` path should become the documented local import in your consuming app.

### The mobile menu does not behave like the preview

Check that the surrounding provider and trigger remain in the same composition and that a parent has not clipped the overlay or created an unexpected scroll container. Re-test focus and Escape behavior after moving navigation. Prefer the existing Kamod sidebar/sheet behavior to a second independent menu state.

### A login form reports success but the user is not signed in

Verify that you replaced demo behavior with your real authentication callback and that the application handles the returned result. Validation and presentation are not a backend. Inspect network failures, service errors and redirect timing in your own integration.

## Keep your copied block maintainable

Treat the copied source as application code. Give local changes a clear purpose, keep domain-specific services outside generic visual helpers, and extract a reusable component only when more than one part of your app needs the same behavior. A little explicit composition is often easier to maintain than a large configuration object for unrelated layouts.

When updating from the repository, compare the new source with your local version rather than replacing the folder blindly. Preserve your routes, content and callbacks while reviewing changes to the supporting components. Re-run the interaction and theme checks affected by the update.

Continue with [Component Styles](/blocks/styles) for density, hierarchy and reusable treatments, or [Theming & Tailwind](/docs/theming/installation) for application-wide colors and runtime appearance. When a general guide and a variant differ in their local file shape, the variant’s current source and setup list are the more specific reference.
