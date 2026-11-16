/** Preview appearance is local to its document; these helpers never persist site preferences. */
import {
  applyColorScheme,
  applyThemePreset,
  isThemePresetId,
  type ThemePresetId,
} from "@kamod-ch/themes";

export type PreviewAppearance = {
  preset: ThemePresetId;
  scheme: "light" | "dark";
  dir?: "ltr" | "rtl";
};

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
  // Nested demos need their own token root. The iframe document already uses :root.
  if (target !== target.ownerDocument.documentElement) {
    target.setAttribute("data-theme-scope", "");
  }
  applyThemePreset(appearance.preset, target);
  applyColorScheme(appearance.scheme, target);
  target.style.colorScheme = appearance.scheme;
  target.dir = appearance.dir ?? "ltr";
}
