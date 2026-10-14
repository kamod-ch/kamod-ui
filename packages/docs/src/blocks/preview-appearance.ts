/** Preview appearance is local to its document; these helpers never persist site preferences. */
import {
  applyColorScheme,
  applyThemePreset,
  isThemePresetId,
  type ThemePresetId,
} from "@kamod-ch/themes";

export type PreviewAppearance = { preset: ThemePresetId; scheme: "light" | "dark" };

/** Scope source appearance without recoloring the surrounding showcase controls. */
export function previewCodeStyle(appearance?: PreviewAppearance) {
  if (!appearance) return undefined;
  const light = appearance.scheme === "light";
  return {
    "--kamod-code-inherit-scheme": appearance.scheme,
    "--kamod-code-inverse-scheme": light ? "dark" : "light",
    "--kamod-code-inherit-light": light ? 1 : 0,
    "--kamod-code-inverse-light": light ? 0 : 1,
    "--kamod-code-primary-light": `var(--theme-${appearance.preset}-primary-light)`,
    "--kamod-code-primary-dark": `var(--theme-${appearance.preset}-primary-dark)`,
  };
}

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
