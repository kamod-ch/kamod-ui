/** Preview appearance is local to its document; these helpers never persist site preferences. */
import {
  applyColorScheme,
  applyThemePreset,
  isThemePresetId,
  type ThemePresetId,
} from "@kamod-ch/themes";

export type PreviewAppearance = { preset: ThemePresetId; scheme: "light" | "dark" };

export function previewAppearanceFromSearch(search: string): PreviewAppearance | undefined {
  const params = new URLSearchParams(search);
  const preset = params.get("previewTheme") ?? "";
  const scheme = params.get("previewScheme");
  if (isThemePresetId(preset) && (scheme === "light" || scheme === "dark")) {
    return { preset, scheme };
  }
}

export function previewAppearanceUrl(path: string, appearance: PreviewAppearance) {
  const params = new URLSearchParams({
    previewTheme: appearance.preset,
    previewScheme: appearance.scheme,
  });
  return `${path}?${params}`;
}

export function applyPreviewAppearance(target: HTMLElement, appearance: PreviewAppearance) {
  applyThemePreset(appearance.preset, target);
  applyColorScheme(appearance.scheme, target);
  target.style.colorScheme = appearance.scheme;
}
