export const THEME_PRESET_STORAGE_KEY = "theme-preset";
export const DEFAULT_THEME_PRESET = "kamod";

export const THEME_PRESETS = [
  { id: "kamod", label: "Kamod" },
  { id: "shadcn", label: "shadcn (Geist)" },
  { id: "ocean", label: "Ocean" },
  { id: "sunset", label: "Sunset" },
  { id: "watson", label: "Watson" }
] as const;

export type ThemePresetId = (typeof THEME_PRESETS)[number]["id"];

const THEME_PRESET_IDS = new Set<string>(THEME_PRESETS.map((preset) => preset.id));

export const isThemePresetId = (value: string): value is ThemePresetId => THEME_PRESET_IDS.has(value);

export const resolveInitialThemePreset = (): ThemePresetId => {
  if (typeof window === "undefined") return DEFAULT_THEME_PRESET;
  const stored = window.localStorage.getItem(THEME_PRESET_STORAGE_KEY);
  if (stored && isThemePresetId(stored)) return stored;
  return DEFAULT_THEME_PRESET;
};

export const applyThemePreset = (preset: ThemePresetId) => {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", preset);
};
