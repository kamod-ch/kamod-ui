/** Runtime guide examples verified against the workspace theme exports. */
export const themeRuntimeReference = `
## Theme runtime reference

\`@kamod-ch/themes\` manages a palette (\`preset\`) and Light/Dark/System preference (\`scheme\`). It updates attributes and persists choices; [theme CSS](/docs/theming/installation#css-setup) supplies colors. Runtime changes do not install styles.

\`ThemeProvider\`, \`useTheme\`, the validator and script helpers are exports. The other entries below are provider options.

| API | Purpose |
| --- | --- |
| [\`ThemeProvider\`](#connect-the-provider) | Provides theme state and setters to its descendants. |
| [\`defaultPreset\`](#choose-starting-values) | Fallback palette; defaults to \`kamod\`. |
| [\`defaultScheme\`](#choose-starting-values) | Fallback preference; defaults to \`system\`. |
| [\`useTheme()\`](#read-and-change-appearance) | Returns \`preset\`, \`presets\`, \`scheme\`, \`resolvedScheme\`, \`setPreset\` and \`setScheme\`. |
| [\`isThemePresetId\`](#check-a-preset-before-applying-it) | Validates a string before passing it to \`setPreset\`. |
| [\`storage\`](#storage-and-initial-appearance) | Synchronous preference adapter; omitted means browser local storage, \`null\` skips provider storage access. |
| [\`ThemeScript\`](#use-the-default-startup-script) | Emits the default early appearance script; accepts an optional \`nonce\`. |
| [\`getThemeInitScript\`](#match-custom-starting-values) | Returns startup script text with custom defaults. |
| [\`attributeTarget\`](#choose-the-theme-target) | Element receiving \`data-theme\` and the \`dark\` class; defaults to \`<html>\`. |

### Connect the provider

Wrap the layout and appearance controls in one provider. \`useTheme()\` throws outside it. Providers share signals; separate providers do not create independent state.

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

#### Choose starting values

Defaults are fallbacks, not forced settings. A valid saved value wins; missing or invalid values use the corresponding default. Use setters for user choices rather than changing defaults as a control. Custom defaults also need a [matching startup script](#match-custom-starting-values).

### Read and change appearance

Render these controls inside \`ThemeBoundary\`. \`presets\` supplies IDs and labels; \`aria-pressed\` identifies the selected preference. For a ready-made control, use [Theme Toggle](/docs/theme-toggle/installation).

\`\`\`tsx src/components/AppearanceControls.tsx
import { isThemePresetId, useTheme } from "@kamod-ch/themes";
import { Button } from "@kamod-ch/ui";

export function AppearanceControls() {
  const { preset, presets, setPreset, scheme, setScheme } = useTheme();
  return (
    <div class="flex flex-wrap items-center gap-2">
      <label>
        Palette
        <select value={preset} onChange={(event) => {
          const next = event.currentTarget.value;
          if (isThemePresetId(next)) setPreset(next);
        }}>
          {presets.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
        </select>
      </label>
      <div role="group" aria-label="Appearance">
        {(["light", "dark", "system"] as const).map((choice) => (
          <Button key={choice} type="button" aria-pressed={scheme === choice}
            variant={scheme === choice ? "default" : "outline"}
            onClick={() => setScheme(choice)}>
            {choice === "system" ? "System" : choice === "dark" ? "Dark" : "Light"}
          </Button>
        ))}
      </div>
    </div>
  );
}
\`\`\`

#### Preference versus visible appearance

With System selected, \`scheme\` stays \`system\`; \`resolvedScheme\` follows the device and is \`light\` or \`dark\`. Use the former for selection and the latter for a visible-mode summary. The provider observes device changes; another \`matchMedia\` listener is unnecessary. Prefer semantic CSS tokens for component styling.

#### Check a preset before applying it

The native select returns a string; \`isThemePresetId\` narrows it to a supported ID. The example ignores invalid input. A valid ID still needs its preset CSS loaded; validation does not load a stylesheet.

### Storage and initial appearance

Omit \`storage\` for browser local storage. Presets use \`theme-preset\`; explicit Light or Dark preferences use \`theme\`. Scheme persistence also updates a \`theme\` cookie.

System removes the stored \`theme\` value and clears that cookie. A later load therefore falls back to \`defaultScheme\`: keep it \`system\` in both provider and startup script if System should remain the natural choice. The provider validates stored values; the startup script reads local storage directly.

#### Skip provider storage access

\`storage={null}\` skips provider storage reads and writes, but scheme-cookie updates and shared runtime state remain. It neither isolates a preview nor disables the separate startup script.

A custom adapter supplies synchronous \`getItem\`, \`setItem\` and \`removeItem\` methods. Handle adapter failures yourself. Startup helpers read browser local storage, not your adapter or cookies; custom persistence needs a matching first-render strategy.

### Match the first render

Emit an early script in the server-rendered document head, before visible content, to reduce an appearance flash. It sets root attributes; it does not replace CSS or the provider. Browser preferences are unavailable during server rendering, so keep initial markup stable across hydration instead of assuming early attributes update server-rendered hook values.

#### Use the default startup script

For \`kamod\` / \`system\`, import \`ThemeScript\` and render \`<ThemeScript nonce={nonce} />\` in the document head. It accepts no custom defaults. If your Content Security Policy requires a nonce, use the value generated for that response.

#### Match custom starting values

Share app-controlled defaults between script and provider. \`getThemeInitScript\` returns text that must be emitted as a script. Do not interpolate untrusted input.

\`\`\`tsx src/components/ThemeSetup.tsx
import { getThemeInitScript, ThemeProvider } from "@kamod-ch/themes";
import type { ComponentChildren } from "preact";

const defaults = { defaultPreset: "ocean", defaultScheme: "system" } as const;

// Render in the initial document head.
export function ThemeHead({ nonce }: { nonce?: string }) {
  return <script nonce={nonce} dangerouslySetInnerHTML={{
    __html: getThemeInitScript(defaults),
  }} />;
}

export function ThemeBoundary({ children }: { children: ComponentChildren }) {
  return <ThemeProvider {...defaults}>{children}</ThemeProvider>;
}
\`\`\`

### Choose the theme target

Omit \`attributeTarget\` for the normal \`<html>\` target. An explicit \`null\` skips attribute writes; it does not disable state or persistence. Acquire a custom \`HTMLElement\` after mounting, never through \`document\` at server module scope.

A custom target still shares runtime state. For local tokens, the full theme CSS supports a \`data-theme-scope\` wrapper with its own \`data-theme\` and \`dark\` class; an unmarked wrapper lacks that token reset. Portalled overlays outside it do not inherit its colors. See [Token Overrides](/docs/theming/installation#token-overrides) before using this advanced option.

### CSS entrypoints

Import \`@kamod-ch/themes/theme.css\` once for the foundation and presets. \`tokens.css\` and \`brands.css\` are pieces for an assembled stylesheet, not additional imports. Keep overrides after the theme entry; [CSS setup](/docs/theming/installation#css-setup) covers Tailwind and source scanning.

#### Check the result before moving on

Change palette, reload a Dark choice, then select System and change device appearance. Check saved preferences, provider placement and startup defaults if behavior differs; see [Troubleshoot and Verify](/docs/theming/installation#accessibility).
`;
