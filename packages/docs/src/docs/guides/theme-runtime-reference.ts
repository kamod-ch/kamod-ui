/** Runtime guide examples verified against the workspace theme exports. */
export const themeRuntimeReference = `
## Theme runtime reference

**Start with a provider and one control.** The runtime is the small part of \`@kamod-ch/themes\` that remembers a palette and a Light, Dark or System preference. Your [theme CSS](/docs/theming/installation#css-setup) still supplies the actual colors. Changing runtime state does not install styles or generate Tailwind utilities.

Think of a **preset** as the palette, such as \`kamod\` or \`ocean\`, and a **scheme** as how that palette is displayed: \`light\`, \`dark\` or \`system\`. You can change either without changing the other. If you only need a ready-made light/dark button, start with [Theme Toggle](/docs/theme-toggle/installation); build your own controls when you want to offer more choices.

Use this table as a shortcut. **\`ThemeProvider\`, \`useTheme\`, the validator and the script helpers are exports.** \`defaultPreset\`, \`defaultScheme\`, \`storage\` and \`attributeTarget\` are options passed to the provider, not separate imports. Every API name below jumps to an explanation and, where useful, an example.

| API | Purpose |
| --- | --- |
| [\`ThemeProvider\`](#connect-the-provider) | Wraps the part of your app that needs theme controls. Start here before calling \`useTheme()\`. |
| [\`defaultPreset\`](#choose-starting-values) | Starting palette when there is no valid saved preset. Defaults to \`kamod\`. |
| [\`defaultScheme\`](#choose-starting-values) | Starting appearance preference when there is no saved scheme. Defaults to \`system\`. |
| [\`useTheme()\`](#read-and-change-appearance) | Reads the current choices and gives you \`setPreset\` and \`setScheme\` to change them. |
| [\`isThemePresetId\`](#check-a-preset-before-applying-it) | Checks whether a string is a supported preset before you apply it. Useful for select fields and external input. |
| [\`storage\`](#storage-and-initial-appearance) | Changes where the provider reads and writes preferences. Omit it for local storage; use \`null\` to skip that storage access. |
| [\`ThemeScript\`](#use-the-default-startup-script) | Adds an early initialization script using package defaults. Place it in the server-rendered document head. |
| [\`getThemeInitScript\`](#match-custom-starting-values) | Creates the same kind of script with custom defaults, so the first paint and provider agree. |
| [\`attributeTarget\`](#choose-the-theme-target) | Advanced: changes which element receives \`data-theme\` and the \`dark\` class. Most apps should omit it. |

### Connect the provider

A **provider** makes a value available to components below it in the component tree. Put one \`ThemeProvider\` around your application layout, then call \`useTheme()\` inside a child. It is not enough to render the provider beside a component that calls the hook.

\`\`\`tsx src/components/ThemedApp.tsx
import { ThemeProvider, useTheme } from "@kamod-ch/themes";
import { Button } from "@kamod-ch/ui";

function AppearanceButton() {
  const { setScheme } = useTheme();
  return (
    <Button type="button" onClick={() => setScheme("dark")}>
      Use dark mode
    </Button>
  );
}

export function ThemedApp() {
  return (
    <ThemeProvider>
      <AppearanceButton />
    </ThemeProvider>
  );
}
\`\`\`

**Try one observable change:** clicking the button selects Dark, updates the document's appearance and, with default storage, saves the choice. Replace \`AppearanceButton\` with your actual app layout after this is working. Keep the provider mounted while navigating between pages instead of recreating it for every screen.

Calling \`useTheme()\` without a provider throws an error. If that happens, check where the component is rendered before changing its event handler. The [Getting Started guide](/docs/getting-started) explains how this theme foundation fits into the rest of your app.

#### Choose starting values

Defaults are **fallbacks, not locked settings**. Choose them for a new visitor; a valid stored preference takes precedence. The package defaults are \`kamod\` and \`system\`. This example starts a new visitor with Ocean while still following their device's appearance:

\`\`\`tsx src/components/ThemeBoundary.tsx
import { ThemeProvider } from "@kamod-ch/themes";
import type { ComponentChildren } from "preact";

export function ThemeBoundary({ children }: { children: ComponentChildren }) {
  return (
    <ThemeProvider defaultPreset="ocean" defaultScheme="system">
      {children}
    </ThemeProvider>
  );
}
\`\`\`

Use \`setPreset\` or \`setScheme\` for a user's later choice; do not repeatedly change the defaults to implement a switch. If your app renders HTML on the server, also [match these defaults in the startup script](#match-custom-starting-values).

### Read and change appearance

\`useTheme()\` returns **current values and the functions that change them**. \`preset\` is the selected palette ID; \`presets\` is the list of supported \`{ id, label }\` entries. \`scheme\` is the selected preference; \`resolvedScheme\` is the resulting Light or Dark appearance.

Offer explicit choices first. These three buttons work without a custom listener, a storage call or direct manipulation of document classes:

\`\`\`tsx src/components/AppearanceChoices.tsx
import { useTheme } from "@kamod-ch/themes";
import { Button } from "@kamod-ch/ui";

export function AppearanceChoices() {
  const { scheme, setScheme } = useTheme();
  return (
    <div role="group" aria-label="Appearance" class="flex flex-wrap gap-2">
      {(["light", "dark", "system"] as const).map((choice) => (
        <Button
          key={choice}
          type="button"
          variant={scheme === choice ? "default" : "outline"}
          aria-pressed={scheme === choice}
          onClick={() => setScheme(choice)}
        >
          {choice === "system" ? "Match device" : choice === "dark" ? "Dark" : "Light"}
        </Button>
      ))}
    </div>
  );
}
\`\`\`

Render this component **inside the provider** from the previous example. \`aria-pressed\` communicates the selected preference to assistive technology; the button variant makes it visible. Keep \`type="button"\` so placing these controls in a settings form does not submit that form accidentally. See the [Button API](/docs/button/installation#api-reference) for other presentation options.

#### Preference versus visible appearance

When someone selects System, \`scheme\` remains \`system\`, while \`resolvedScheme\` follows the device and is either \`light\` or \`dark\`. **Use \`scheme\` to mark the selected setting; use \`resolvedScheme\` when describing the visible result.** Most styling should still use semantic CSS tokens instead of branching your entire UI in JavaScript.

\`\`\`tsx src/components/AppearanceSummary.tsx
import { useTheme } from "@kamod-ch/themes";

export function AppearanceSummary() {
  const { scheme, resolvedScheme } = useTheme();
  return (
    <p>
      {scheme === "system" ? "Following your device" : "Using your chosen appearance"}
      {" — "}{resolvedScheme === "dark" ? "dark" : "light"} mode.
    </p>
  );
}
\`\`\`

The provider already observes device appearance changes. **Do not add a second \`matchMedia\` listener** for these controls. The [appearance preferences guide](/docs/theming/installation#provider-controls) connects this behavior to the wider theme setup.

#### Check a preset before applying it

A select field produces a string. \`isThemePresetId\` checks that string against the package's supported preset IDs and lets TypeScript safely pass it to \`setPreset\`. Use the runtime's \`presets\` list so labels and available options stay together.

\`\`\`tsx src/components/PresetSelect.tsx
import { isThemePresetId, useTheme } from "@kamod-ch/themes";
import { useId } from "preact/hooks";

export function PresetSelect() {
  const id = useId();
  const { preset, presets, setPreset } = useTheme();
  return (
    <div>
      <label htmlFor={id}>Color palette</label>
      <select
        id={id}
        value={preset}
        onChange={(event) => {
          const value = event.currentTarget.value;
          if (isThemePresetId(value)) setPreset(value);
        }}
      >
        {presets.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
      </select>
    </div>
  );
}
\`\`\`

An invalid value is ignored, leaving the current palette intact. This example uses a native select to make the data flow easy to see; use [Native Select](/docs/native-select/installation) when you are ready to apply the library's control styling. A valid preset ID still needs its CSS to be loaded: use the complete theme entry unless you deliberately assemble a smaller stylesheet.

### Storage and initial appearance

**For most applications, omit \`storage\`.** The provider uses browser local storage when it is available. The preset is stored under \`theme-preset\`; explicit Light or Dark choices use \`theme\`. Appearance changes made through the runtime also update a \`theme\` cookie.

Choosing System removes the stored \`theme\` value and clears that cookie. On the next load, a missing value falls back to \`defaultScheme\`. If you want System to remain the natural choice on later visits, keep \`defaultScheme="system"\` in both the provider and startup script.

#### Skip provider storage access

For a temporary example, pass \`storage={null}\`. This skips the provider's storage reads and writes; it **does not create isolated theme state**, and explicit scheme changes can still write the scheme cookie.

\`\`\`tsx src/components/TemporaryTheme.tsx
import { ThemeProvider } from "@kamod-ch/themes";
import type { ComponentChildren } from "preact";

export function TemporaryTheme({ children }: { children: ComponentChildren }) {
  return <ThemeProvider storage={null}>{children}</ThemeProvider>;
}
\`\`\`

Use this instead of the default provider for that example, rather than stacking providers to simulate unrelated themes. The runtime uses shared signals, so multiple providers can affect the same selection. The startup script also reads browser local storage independently; \`storage={null}\` is not a setting for that script.

A custom adapter must supply \`getItem\`, \`setItem\` and \`removeItem\`, matching the synchronous browser Storage methods. It is not an asynchronous database API. Custom adapters should handle their own failures. The default startup helpers read local storage, so a different adapter needs a matching first-render strategy rather than assuming it will be read automatically.

### Match the first render

An early script helps the browser apply the saved appearance **before the page becomes visible**. Without it, the page can first appear in its default colors and then switch after the app starts. The script prepares document attributes; it does not replace your stylesheet or provider.

#### Use the default startup script

If you use the package's default \`kamod\` and \`system\` settings, render \`ThemeScript\` in your framework's **server-rendered document head**, before visible content. This small component is intended to be used in that head slot:

\`\`\`tsx src/components/ThemeHead.tsx
import { ThemeScript } from "@kamod-ch/themes";

export function ThemeHead({ nonce }: { nonce?: string }) {
  return <ThemeScript nonce={nonce} />;
}
\`\`\`

\`nonce\` is optional. If your application uses a Content Security Policy that requires one, pass the nonce generated for that response; do not hard-code a shared value. \`ThemeScript\` accepts the nonce, but **does not accept custom preset or scheme defaults**. Use the next example for those.

#### Match custom starting values

Define custom defaults once and share them between the provider and \`getThemeInitScript\`. The helper returns **script text**: assigning it to a variable is not enough. It must be emitted as an inline script in the initial document head through your framework's document API.

\`\`\`tsx src/components/ThemeSetup.tsx
import { getThemeInitScript, ThemeProvider } from "@kamod-ch/themes";
import type { ComponentChildren } from "preact";

const defaults = { defaultPreset: "ocean", defaultScheme: "system" } as const;

// Render this component in the server document's head.
export function ThemeHead({ nonce }: { nonce?: string }) {
  return <script nonce={nonce} dangerouslySetInnerHTML={{
    __html: getThemeInitScript(defaults),
  }} />;
}

// Use this boundary around the app's theme controls and pages.
export function ThemeBoundary({ children }: { children: ComponentChildren }) {
  return <ThemeProvider {...defaults}>{children}</ThemeProvider>;
}
\`\`\`

Keep those defaults app-controlled. Do not construct script contents from untrusted input. Avoid reading \`window\`, \`document\` or local storage during server rendering, and keep the initial markup stable across hydration. The script sets appearance attributes early; it does not make every server-rendered \`useTheme()\` value reflect a browser's saved preference. See [The Server and First Render](/docs/packages#package-ssr) for the wider rendering boundary.

### Choose the theme target

**Leave \`attributeTarget\` out for a normal application.** The provider then writes \`data-theme\` and the \`dark\` class to the document's root \`<html>\` element. This is the element the built-in preset selectors are designed for.

Pass an actual \`HTMLElement\` only for an integration that deliberately manages another target. Acquire that element after mounting, through a ref or an effect; do not read \`document\` at module scope in server-rendered code. Passing \`null\` supplies no target and skips those attribute writes until a real target is provided.

A custom target is **not an independent theme sandbox**. It still uses the shared runtime state, and the built-in preset CSS includes \`:root[data-theme="…"]\` selectors. Moving attributes onto an arbitrary wrapper alone will not move those root-only color definitions with them. Plan custom scoped CSS and any portalled overlays together. Read [Token Overrides](/docs/theming/installation#token-overrides) before choosing this advanced option.

### CSS entrypoints

Use **one complete theme entry** for a typical app:

\`\`\`css src/styles/app.css
@import "tailwindcss";
@import "@kamod-ch/themes/theme.css";
\`\`\`

\`theme.css\` supplies the combined theme foundation and built-in presets. \`tokens.css\` and \`brands.css\` are available for a deliberately assembled stylesheet; they are not additional imports you must stack on top of the complete entry. Keep your app's overrides after the theme import and follow the [CSS setup](/docs/theming/installation#css-setup) for source scanning and build integration.

#### Check the result before moving on

Start with the preset selector: **change the palette** and confirm that several components respond. Next choose Dark, reload, and confirm that the choice is restored. Finally choose System and change the device appearance while the page is open. Keyboard focus should remain visible throughout.

If something fails, narrow it down: missing colors usually point to the [stylesheet setup](/docs/theming/installation#css-setup); a hook error points to the provider boundary; a flash during reload points to the [startup script](#match-the-first-render); an unexpected default may be an existing saved preference. Continue with [Troubleshoot and Verify](/docs/theming/installation#accessibility) for the full checks, then apply the same foundation to [Component Styles](/blocks/styles) and [Block Theming](/blocks/theming).
`;
