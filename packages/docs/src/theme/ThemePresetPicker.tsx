import { ThemePicker, type ThemePickerProps } from "@kamod-ch/blocks/shared";
import { colorSchemeSignal, setColorScheme, setThemePreset } from "@kamod-ch/themes";
import { withBasePath } from "../base-path";
import { useSiteThemePreset } from "./useSiteThemePreset";

/** Site adapter: global signals and persistence stay outside the reusable picker. */
export function ThemePresetPicker({
  side,
  showLabel,
}: Pick<ThemePickerProps, "side" | "showLabel">) {
  return (
    <ThemePicker
      preset={useSiteThemePreset()}
      onPresetChange={setThemePreset}
      scheme={colorSchemeSignal.value}
      onSchemeChange={setColorScheme}
      side={side}
      showLabel={showLabel}
      triggerClass={`site-icon-button${showLabel ? " site-theme-picker-labeled" : ""}`}
      resolveHref={withBasePath}
    />
  );
}
