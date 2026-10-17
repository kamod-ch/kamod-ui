import { MoonIcon, SunIcon } from "@kamod-ch/icons/lucide";
import type { ThemePresetId } from "@kamod-ch/themes";

import { PaletteSketch } from "./PaletteSketch";

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
        <span>3 composition studies</span>
      </figcaption>
      <div class={`theme-study-preview ${scheme}`} data-theme-scope="" data-theme={preset}>
        <div class="theme-study-sketches">
          <PaletteSketch kind="workspace" />
          <PaletteSketch kind="action" />
          <PaletteSketch kind="feature" />
        </div>
      </div>
    </figure>
  );
}
