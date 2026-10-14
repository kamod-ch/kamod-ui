import { CheckIcon, LayersIcon, MoonIcon, SunIcon } from "@kamod-ch/icons/lucide";
import type { ThemePresetId } from "@kamod-ch/themes";

const roles = [
  ["Page", "background"],
  ["Card", "card"],
  ["Primary", "primary"],
  ["Secondary", "secondary"],
  ["Muted", "muted"],
  ["Success", "success"],
] as const;

/** A static, isolated color study: no provider, iframe, storage or event subscriptions. */
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
        <Icon size={13} aria-hidden="true" />
        {scheme === "light" ? "Light" : "Dark"} appearance
      </figcaption>
      <div class={`theme-study-preview ${scheme}`} data-theme-scope="" data-theme={preset}>
        <div class="theme-study-workspace" aria-hidden="true">
          <div class="theme-study-rail">
            <LayersIcon size={17} />
            <span class="theme-study-rail-selection" />
            <span />
            <span />
          </div>
          <div class="theme-study-stage">
            <div class="theme-study-stage-heading">
              <strong>Your workspace</strong>
              <span class="theme-study-tag">Overview</span>
            </div>
            <div class="theme-study-task">
              <span class="theme-study-orbit">
                <LayersIcon size={19} />
              </span>
              <strong>Make room for good ideas.</strong>
              <span class="theme-study-description">A shared foundation. Your next project.</span>
              <div class="theme-study-task-footer">
                <span class="theme-study-ready">
                  <CheckIcon size={12} />
                  Ready
                </span>
                <span class="theme-study-action">
                  Continue<span>↗</span>
                </span>
              </div>
            </div>
            <div class="theme-study-notes">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
        <dl class="theme-study-roles">
          {roles.map(([label, token]) => (
            <div key={token}>
              <dt>{label}</dt>
              <dd style={{ background: `var(--${token})` }} title={`--${token}`}>
                <span class="sr-only">{`--${token}`}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </figure>
  );
}
