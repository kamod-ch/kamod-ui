import { ChevronDownIcon, MoonIcon, SunIcon } from "@kamod-ch/icons/lucide";
import type { ThemePresetId } from "@kamod-ch/themes";

const surfaceRoles = [
  ["Page", "background"],
  ["Card", "card"],
  ["Primary", "primary"],
  ["Secondary", "secondary"],
] as const;
const detailRoles = [
  ["Text", "foreground"],
  ["Quiet surface", "muted"],
  ["Quiet text", "muted-foreground"],
  ["Selection", "accent"],
  ["Boundary", "border"],
  ["Navigation", "sidebar-background"],
  ["Success", "success"],
  ["Danger", "destructive"],
] as const;

/** Static composition studies, not loading placeholders: no animation or simulated controls. */
function PaletteSketch({ kind }: { kind: "workspace" | "action" }) {
  return (
    <div class={`theme-study-sketch theme-study-sketch-${kind}`} data-palette-sketch={kind}>
      <div class="theme-study-sketch-art" aria-hidden="true">
        {kind === "workspace" ? (
          <>
            <div class="theme-study-sketch-rail">
              <i />
              <i />
              <i />
            </div>
            <div class="theme-study-sketch-content">
              <b />
              <span />
              <div class="theme-study-sketch-sheet">
                <i />
                <i />
                <i />
              </div>
            </div>
          </>
        ) : (
          <div class="theme-study-sketch-content">
            <i class="theme-study-sketch-mark" />
            <b />
            <span />
            <span />
            <div class="theme-study-sketch-actions">
              <i class="theme-study-action" />
              <i />
            </div>
          </div>
        )}
      </div>
      <p class="theme-study-sketch-label">{kind === "workspace" ? "Workspace" : "Action card"}</p>
    </div>
  );
}

/** Every comparison consumes real preset CSS inside one explicit appearance boundary. */
export function ThemePalettePreview({
  preset,
  scheme,
}: {
  preset: ThemePresetId;
  scheme: "light" | "dark";
}) {
  const Icon = scheme === "light" ? SunIcon : MoonIcon;
  return (
    <figure class="theme-study-sample">
      <figcaption>
        <span>
          <Icon size={13} aria-hidden="true" />
          {scheme === "light" ? "Light" : "Dark"} appearance
        </span>
        <span>2 compositions</span>
      </figcaption>
      <div class={`theme-study-preview ${scheme}`} data-theme-scope="" data-theme={preset}>
        <div class="theme-study-sketches">
          <PaletteSketch kind="workspace" />
          <PaletteSketch kind="action" />
        </div>
        <dl class="theme-study-roles">
          {surfaceRoles.map(([label, token]) => (
            <div key={token}>
              <dt>{label}</dt>
              <dd style={{ background: `var(--${token})` }} title={`--${token}`}>
                <span class="sr-only">{`--${token}`}</span>
              </dd>
            </div>
          ))}
        </dl>
        <details class="theme-study-token-details">
          <summary>
            Look inside the palette <ChevronDownIcon size={13} aria-hidden="true" />
          </summary>
          <dl>
            {detailRoles.map(([label, token]) => (
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
        </details>
      </div>
    </figure>
  );
}
