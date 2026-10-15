import { ChevronDownIcon, MoonIcon, SunIcon } from "@kamod-ch/icons/lucide";
import type { ThemePresetId } from "@kamod-ch/themes";

import { PaletteSketch } from "./PaletteSketch";

const mainRoles = [
  ["Primary", "primary"],
  ["Secondary", "secondary"],
  ["Accent", "accent"],
  ["Canvas", "background"],
  ["Surface", "card"],
  ["Muted", "muted"],
  ["Danger", "destructive"],
  ["Sidebar", "sidebar-background"],
] as const;
const detailRoles = [
  ["Text", "foreground"],
  ["Primary text", "primary-foreground"],
  ["Secondary text", "secondary-foreground"],
  ["Quiet text", "muted-foreground"],
  ["Boundary", "border"],
  ["Focus", "outline"],
  ["Success", "success"],
  ["Warning", "warning"],
] as const;

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
        <span>8 roles · 3 sketches</span>
      </figcaption>
      <div class={`theme-study-preview ${scheme}`} data-theme-scope="" data-theme={preset}>
        <dl class="theme-study-colors" aria-label={`${scheme} appearance main colors`}>
          {mainRoles.map(([label, token]) => (
            <div key={token}>
              <dt>
                {label}
                <code>{`--${token}`}</code>
              </dt>
              <dd style={{ background: `var(--${token})` }}>
                <span class="sr-only">{`Color from --${token}`}</span>
              </dd>
            </div>
          ))}
        </dl>
        <div class="theme-study-composition-heading">
          <strong>In composition</strong>
          <span>Static layout studies</span>
        </div>
        <div class="theme-study-sketches">
          <PaletteSketch kind="workspace" />
          <PaletteSketch kind="action" />
          <PaletteSketch kind="feature" />
        </div>
        <details class="theme-study-token-details">
          <summary>
            Text, focus & feedback <ChevronDownIcon size={13} aria-hidden="true" />
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
