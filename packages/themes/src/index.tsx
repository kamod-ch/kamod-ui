import { signal, effect as signalEffect } from "@preact/signals";
import { type ComponentChildren, createContext } from "preact";
import { useContext, useEffect, useLayoutEffect, useMemo, useState } from "preact/hooks";

export const THEME_STORAGE_KEY = "theme";
export const THEME_PRESET_STORAGE_KEY = "theme-preset";
export const DEFAULT_COLOR_SCHEME = "system";
export const DEFAULT_THEME_PRESET = "kamod";

export const THEME_PRESETS = [
  { id: "kamod", label: "Kamod" },
  { id: "shadcn", label: "shadcn (Geist)" },
  { id: "ocean", label: "Ocean" },
  { id: "sunset", label: "Sunset" },
  { id: "cursor-warm", label: "Cursor warm" },
  { id: "voltage", label: "Voltage" },
  { id: "watson", label: "Watson" },
  { id: "professional", label: "Professional (Electronics)" },
] as const;

export type ThemePresetId = (typeof THEME_PRESETS)[number]["id"];
export type ColorScheme = "light" | "dark" | "system";
export type ResolvedColorScheme = "light" | "dark";

export type ThemeStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export type ThemeProviderProps = {
  children?: ComponentChildren;
  defaultPreset?: ThemePresetId;
  defaultScheme?: ColorScheme;
  storage?: ThemeStorage | null;
  attributeTarget?: HTMLElement | null;
};

export type ThemeContextValue = {
  preset: ThemePresetId;
  setPreset: (preset: ThemePresetId) => void;
  scheme: ColorScheme;
  setScheme: (scheme: ColorScheme) => void;
  resolvedScheme: ResolvedColorScheme;
  presets: typeof THEME_PRESETS;
};

const THEME_PRESET_IDS = new Set<string>(THEME_PRESETS.map((preset) => preset.id));
const COLOR_SCHEMES = new Set<string>(["light", "dark", "system"]);

const ThemeContext = createContext<ThemeContextValue | null>(null);

const hasDOM = () => typeof window !== "undefined" && typeof document !== "undefined";

const getDefaultStorage = (): ThemeStorage | null => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const getDefaultTarget = () => (typeof document === "undefined" ? null : document.documentElement);

const readSystemScheme = (): ResolvedColorScheme => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const isThemePresetId = (value: string): value is ThemePresetId =>
  THEME_PRESET_IDS.has(value);

export const resolveInitialThemePreset = (
  storage: ThemeStorage | null = getDefaultStorage(),
  fallback: ThemePresetId = DEFAULT_THEME_PRESET,
): ThemePresetId => {
  const stored = storage?.getItem(THEME_PRESET_STORAGE_KEY);
  if (stored && isThemePresetId(stored)) return stored;
  return fallback;
};

export const resolveInitialColorScheme = (
  storage: ThemeStorage | null = getDefaultStorage(),
  fallback: ColorScheme = DEFAULT_COLOR_SCHEME,
): ColorScheme => {
  const stored = storage?.getItem(THEME_STORAGE_KEY);
  if (stored && COLOR_SCHEMES.has(stored)) return stored as ColorScheme;
  return fallback;
};

export const readThemePresetFromDom = (
  target: HTMLElement | null = getDefaultTarget(),
): ThemePresetId | null => {
  const value = target?.getAttribute("data-theme");
  return value && isThemePresetId(value) ? value : null;
};

export const applyThemePreset = (
  preset: ThemePresetId,
  target: HTMLElement | null = getDefaultTarget(),
) => {
  target?.classList.add("theme-switching");
  target?.setAttribute("data-theme", preset);
  clearThemeSwitching(target);
};

const clearThemeSwitching = (target: HTMLElement | null) => {
  if (!target) return;
  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        target.classList.remove("theme-switching");
      });
    });
    return;
  }
  target.classList.remove("theme-switching");
};

export const applyColorScheme = (
  scheme: ColorScheme,
  target: HTMLElement | null = getDefaultTarget(),
): ResolvedColorScheme => {
  target?.classList.add("theme-switching");
  const resolvedScheme = scheme === "system" ? readSystemScheme() : scheme;
  target?.classList.toggle("dark", resolvedScheme === "dark");
  clearThemeSwitching(target);
  return resolvedScheme;
};

export const persistColorScheme = (
  scheme: ColorScheme,
  storage: ThemeStorage | null = getDefaultStorage(),
) => {
  if (scheme === "system") {
    storage?.removeItem(THEME_STORAGE_KEY);
    if (typeof document !== "undefined") {
      document.cookie = `${THEME_STORAGE_KEY}=; path=/; max-age=0; SameSite=Lax`;
    }
    return;
  }

  storage?.setItem(THEME_STORAGE_KEY, scheme);
  if (typeof document !== "undefined") {
    document.cookie = `${THEME_STORAGE_KEY}=${scheme}; path=/; max-age=31536000; SameSite=Lax`;
  }
};

export const themePresetSignal = signal<ThemePresetId>(resolveInitialThemePreset());
export const colorSchemeSignal = signal<ColorScheme>(resolveInitialColorScheme());
export const resolvedColorSchemeSignal = signal<ResolvedColorScheme>(
  colorSchemeSignal.value === "system" ? readSystemScheme() : colorSchemeSignal.value,
);

export const setThemePreset = (
  preset: ThemePresetId,
  storage: ThemeStorage | null = getDefaultStorage(),
  target: HTMLElement | null = getDefaultTarget(),
) => {
  themePresetSignal.value = preset;
  applyThemePreset(preset, target);
  storage?.setItem(THEME_PRESET_STORAGE_KEY, preset);
};

export const setColorScheme = (
  scheme: ColorScheme,
  storage: ThemeStorage | null = getDefaultStorage(),
  target: HTMLElement | null = getDefaultTarget(),
) => {
  colorSchemeSignal.value = scheme;
  const resolvedScheme = applyColorScheme(scheme, target);
  resolvedColorSchemeSignal.value = resolvedScheme;
  persistColorScheme(scheme, storage);
};

export const syncThemeFromStorage = (
  storage: ThemeStorage | null = getDefaultStorage(),
  target: HTMLElement | null = getDefaultTarget(),
  defaultPreset: ThemePresetId = DEFAULT_THEME_PRESET,
  defaultScheme: ColorScheme = DEFAULT_COLOR_SCHEME,
) => {
  const preset = resolveInitialThemePreset(storage, defaultPreset);
  const scheme = resolveInitialColorScheme(storage, defaultScheme);
  themePresetSignal.value = preset;
  colorSchemeSignal.value = scheme;
  applyThemePreset(preset, target);
  resolvedColorSchemeSignal.value = applyColorScheme(scheme, target);
};

const resolveThemePresetForClient = (
  storage: ThemeStorage | null = getDefaultStorage(),
  target: HTMLElement | null = getDefaultTarget(),
  fallback: ThemePresetId = DEFAULT_THEME_PRESET,
): ThemePresetId => readThemePresetFromDom(target) ?? resolveInitialThemePreset(storage, fallback);

export const useThemePreset = (
  storage: ThemeStorage | null = getDefaultStorage(),
  target: HTMLElement | null = getDefaultTarget(),
  defaultPreset: ThemePresetId = DEFAULT_THEME_PRESET,
): ThemePresetId => {
  const [revision, setRevision] = useState(0);

  useLayoutEffect(() => {
    syncThemeFromStorage(storage, target, defaultPreset);

    const dispose = signalEffect(() => {
      themePresetSignal.value;
      setRevision((count) => count + 1);
    });

    return dispose;
  }, [defaultPreset, storage, target]);

  void revision;

  if (typeof document === "undefined") {
    return defaultPreset;
  }

  return resolveThemePresetForClient(storage, target, defaultPreset);
};

export const getThemeInitScript = ({
  defaultPreset = DEFAULT_THEME_PRESET,
  defaultScheme = DEFAULT_COLOR_SCHEME,
}: {
  defaultPreset?: ThemePresetId;
  defaultScheme?: ColorScheme;
} = {}) =>
  `(() => {try {var d=document.documentElement;var p=localStorage.getItem("${THEME_PRESET_STORAGE_KEY}")||"${defaultPreset}";d.setAttribute("data-theme",p);var s=localStorage.getItem("${THEME_STORAGE_KEY}")||"${defaultScheme}";var dark=s==="dark"||(s==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);d.classList.toggle("dark",dark);} catch (_) {}})();`;

export const ThemeScript = ({ nonce }: { nonce?: string }) => (
  <script nonce={nonce} dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />
);

export const ThemeProvider = ({
  children,
  defaultPreset = DEFAULT_THEME_PRESET,
  defaultScheme = DEFAULT_COLOR_SCHEME,
  storage,
  attributeTarget,
}: ThemeProviderProps) => {
  const resolvedStorage = storage === undefined ? getDefaultStorage() : storage;
  const target = attributeTarget === undefined ? getDefaultTarget() : attributeTarget;

  const preset = themePresetSignal.value;
  const scheme = colorSchemeSignal.value;
  const resolvedScheme = resolvedColorSchemeSignal.value;

  useEffect(() => {
    syncThemeFromStorage(resolvedStorage, target, defaultPreset, defaultScheme);
  }, [defaultPreset, defaultScheme, resolvedStorage, target]);

  useEffect(() => {
    const disposePreset = signalEffect(() => {
      const nextPreset = themePresetSignal.value;
      applyThemePreset(nextPreset, target);
      resolvedStorage?.setItem(THEME_PRESET_STORAGE_KEY, nextPreset);
    });

    const disposeScheme = signalEffect(() => {
      const nextScheme = colorSchemeSignal.value;
      resolvedColorSchemeSignal.value = applyColorScheme(nextScheme, target);
      persistColorScheme(nextScheme, resolvedStorage);
    });

    return () => {
      disposePreset();
      disposeScheme();
    };
  }, [resolvedStorage, target]);

  useEffect(() => {
    if (!hasDOM()) return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key === THEME_PRESET_STORAGE_KEY && event.newValue) {
        if (isThemePresetId(event.newValue)) {
          themePresetSignal.value = event.newValue;
          applyThemePreset(event.newValue, target);
        }
        return;
      }

      if (event.key === THEME_STORAGE_KEY) {
        const nextScheme =
          event.newValue && COLOR_SCHEMES.has(event.newValue)
            ? (event.newValue as ColorScheme)
            : defaultScheme;
        colorSchemeSignal.value = nextScheme;
        resolvedColorSchemeSignal.value = applyColorScheme(nextScheme, target);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [defaultScheme, target]);

  useEffect(() => {
    if (!hasDOM() || typeof window.matchMedia !== "function") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (colorSchemeSignal.value === "system") {
        resolvedColorSchemeSignal.value = applyColorScheme("system", target);
      }
    };
    media.addEventListener?.("change", handleChange);
    return () => media.removeEventListener?.("change", handleChange);
  }, [target]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      preset,
      setPreset: (nextPreset) => setThemePreset(nextPreset, resolvedStorage, target),
      scheme,
      setScheme: (nextScheme) => setColorScheme(nextScheme, resolvedStorage, target),
      resolvedScheme,
      presets: THEME_PRESETS,
    }),
    [preset, resolvedStorage, resolvedScheme, scheme, target],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used within a ThemeProvider");
  return value;
};
