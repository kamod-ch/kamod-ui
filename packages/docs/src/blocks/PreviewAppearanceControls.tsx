import { ThemePicker, useSystemColorScheme } from "@kamod-ch/blocks/shared";
import { MoonIcon, SunIcon } from "@kamod-ch/icons/lucide";
import type { ColorScheme } from "@kamod-ch/themes";
import { useEffect, useState } from "preact/hooks";
import { withBasePath } from "../base-path";
import type { PreviewAppearance } from "./preview-appearance";

/** Local adapter: preview changes never write the site's theme preferences. */
export function PreviewAppearanceControls({
  value,
  onChange,
}: {
  value: PreviewAppearance;
  onChange: (value: PreviewAppearance) => void;
}) {
  const [system, setSystem] = useState(false);
  const systemScheme = useSystemColorScheme(system);
  const isDark = value.scheme === "dark";
  const SchemeIcon = isDark ? MoonIcon : SunIcon;
  useEffect(() => {
    if (system && value.scheme !== systemScheme) onChange({ ...value, scheme: systemScheme });
  }, [system, systemScheme, value, onChange]);
  const changeScheme = (scheme: ColorScheme) => {
    setSystem(scheme === "system");
    if (scheme !== "system") onChange({ ...value, scheme });
  };
  return (
    <div
      class="blocks-showcase-segmented blocks-showcase-appearance"
      role="group"
      aria-label="Preview appearance"
    >
      <button
        type="button"
        class="docs-icon-button blocks-showcase-control"
        aria-label="Dark preview"
        aria-pressed={isDark}
        title={`Switch preview to ${isDark ? "light" : "dark"} mode`}
        onClick={() => changeScheme(isDark ? "light" : "dark")}
      >
        <SchemeIcon size={17} aria-hidden="true" />
      </button>
      <ThemePicker
        preset={value.preset}
        onPresetChange={(preset) => onChange({ ...value, preset })}
        scheme={system ? "system" : value.scheme}
        onSchemeChange={changeScheme}
        triggerClass="blocks-showcase-control"
        labelClass="blocks-showcase-control-label"
        label="Preview color theme"
        showLabel
        resolveHref={withBasePath}
      />
    </div>
  );
}
