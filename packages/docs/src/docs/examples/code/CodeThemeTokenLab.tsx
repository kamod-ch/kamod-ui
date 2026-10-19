import { THEME_PRESETS, type ThemePresetId } from "@kamod-ch/themes";
import { useState } from "preact/hooks";
import { ReferenceCode as Code } from "../../../references/ReferenceCode";

const source = `// Your app's palette, expressed as source.
export function greet(name = "Kamod") {
  const count = 3;
  return { message: name, ready: true, count };
}`;
const roles = [
  ["Declarations", "primary"],
  ["Functions", "chart-1"],
  ["Strings", "chart-2"],
  ["Properties", "chart-3"],
  ["Numbers", "chart-4"],
  ["Variables", "chart-5"],
] as const;

/** A local CSS-only palette study; changing it never writes site preferences or reloads Prism. */
export function CodeThemeTokenLab() {
  const [preset, setPreset] = useState<ThemePresetId>("ocean");
  const [scheme, setScheme] = useState<"light" | "dark">("light");
  return (
    <div class="code-theme-token-lab" data-code-demo="theme-tokens">
      <div class="code-theme-token-controls">
        <label>
          Application palette
          <select
            value={preset}
            onChange={(event) => setPreset(event.currentTarget.value as ThemePresetId)}
          >
            {THEME_PRESETS.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Local appearance
          <select
            value={scheme}
            onChange={(event) => setScheme(event.currentTarget.value as "light" | "dark")}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <span>
          Preview only <span aria-hidden="true">·</span> your page stays as it is
        </span>
      </div>
      <div data-theme-scope="" data-theme={preset} class={`code-theme-token-preview ${scheme}`}>
        <Code
          readingControls="overflow"
          code={source}
          language="typescript"
          syntaxTheme="theme"
          showToolbar={false}
          showCopy={false}
          showImportControl={false}
          showWrapControl={false}
          defaultWrapped
        />
        <dl class="code-theme-token-roles">
          {roles.map(([label, token]) => (
            <div key={token}>
              <dt>
                <span aria-hidden="true" style={{ background: `var(--${token})` }} />
                {label}
              </dt>
              <dd>
                <code>{`--${token}`}</code>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
