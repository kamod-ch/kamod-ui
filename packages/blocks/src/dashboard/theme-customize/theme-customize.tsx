import {
  applyColorScheme,
  applyThemePreset,
  type ColorScheme,
  colorSchemeSignal,
  persistColorScheme,
  resolvedColorSchemeSignal,
  setColorScheme,
  setThemePreset,
  THEME_PRESETS,
  type ThemePresetId,
  type ThemeStorage,
  themePresetSignal,
} from "@kamod-ch/themes";
import { Button, CopyButton, Label, Slider } from "@kamod-ch/ui";
import { useEffect, useRef } from "preact/hooks";
import { canUseDOM, ThemePicker, useControllableState } from "../../shared";

const RADIUS_STORAGE_KEY = "theme-radius";

export type ThemeCopyStatus = "idle" | "copied" | "error";

export type ThemeCustomizeProps = {
  scheme?: ColorScheme;
  defaultScheme?: ColorScheme;
  onSchemeChange?: (scheme: ColorScheme) => void;
  preset?: ThemePresetId;
  defaultPreset?: ThemePresetId;
  onPresetChange?: (preset: ThemePresetId) => void;
  radius?: number;
  defaultRadius?: number;
  onRadiusChange?: (radius: number) => void;
  persist?: boolean;
  storage?: ThemeStorage | null;
  target?: HTMLElement | string;
  presets?: readonly { id: ThemePresetId; label: string }[];
};

const resolveTarget = (
  target: HTMLElement | string | undefined,
  fallback: HTMLElement | null,
): HTMLElement | null => {
  if (!canUseDOM()) return null;
  if (typeof target === "string") return document.querySelector<HTMLElement>(target);
  if (target) return target;
  return fallback;
};

const readStoredRadius = (storage: ThemeStorage | null, fallback: number): number => {
  const raw = storage?.getItem(RADIUS_STORAGE_KEY);
  const parsed = raw == null ? Number.NaN : Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const ThemeCustomize = ({
  scheme,
  defaultScheme = "system",
  onSchemeChange,
  preset,
  defaultPreset = "kamod",
  onPresetChange,
  radius,
  defaultRadius = 0.625,
  onRadiusChange,
  persist = false,
  storage,
  target,
  presets = THEME_PRESETS,
}: ThemeCustomizeProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const resolvedStorage = persist
    ? storage === undefined
      ? canUseDOM()
        ? window.localStorage
        : null
      : storage
    : null;
  const [mode, setMode] = useControllableState<ColorScheme>({
    value: scheme,
    defaultValue: defaultScheme,
    onChange: onSchemeChange,
  });
  const [brand, setBrand] = useControllableState<ThemePresetId>({
    value: preset,
    defaultValue: defaultPreset,
    onChange: onPresetChange,
  });
  const [corner, setCorner] = useControllableState<number>({
    value: radius,
    defaultValue: persist ? readStoredRadius(resolvedStorage, defaultRadius) : defaultRadius,
    onChange: onRadiusChange,
  });
  const originalRadius = useRef<string | null>(null);

  useEffect(() => {
    const node = resolveTarget(target, rootRef.current);
    if (!node) return;
    if (persist) {
      setColorScheme(mode, resolvedStorage, node);
      setThemePreset(brand, resolvedStorage, node);
      return;
    }
    applyColorScheme(mode, node);
    applyThemePreset(brand, node);
  }, [brand, mode, persist, resolvedStorage, target]);

  useEffect(() => {
    const node = resolveTarget(target, rootRef.current);
    if (!node) return;
    if (originalRadius.current == null) {
      originalRadius.current = node.style.getPropertyValue("--radius");
    }
    node.style.setProperty("--radius", `${corner}rem`);
    if (persist) resolvedStorage?.setItem(RADIUS_STORAGE_KEY, String(corner));
  }, [corner, persist, resolvedStorage, target]);

  useEffect(() => {
    const nodeAtMount = resolveTarget(target, rootRef.current);
    return () => {
      const node = resolveTarget(target, rootRef.current) ?? nodeAtMount;
      if (!node) return;
      const original = originalRadius.current;
      if (original) node.style.setProperty("--radius", original);
      else node.style.removeProperty("--radius");
    };
  }, [target]);

  useEffect(() => {
    if (!canUseDOM() || typeof window.matchMedia !== "function") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (mode !== "system") return;
      const node = resolveTarget(target, rootRef.current);
      const resolved = applyColorScheme("system", node);
      if (persist) resolvedColorSchemeSignal.value = resolved;
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [mode, persist, target]);

  const cssSnippet = [
    `/* Kamod theme-customize */`,
    `--radius: ${corner}rem;`,
    `data-theme: ${brand};`,
    `color-scheme: ${mode};`,
  ].join("\n");

  const onReset = () => {
    setMode(defaultScheme);
    setBrand(defaultPreset);
    setCorner(defaultRadius);
    resolvedStorage?.removeItem(RADIUS_STORAGE_KEY);
    const node = resolveTarget(target, rootRef.current);
    applyThemePreset(defaultPreset, node);
    applyColorScheme(defaultScheme, node);
    if (persist) {
      persistColorScheme(defaultScheme, resolvedStorage);
      colorSchemeSignal.value = defaultScheme;
      themePresetSignal.value = defaultPreset;
    }
  };

  return (
    <div
      ref={rootRef}
      data-slot="block-theme-customize"
      class="flex justify-center bg-background p-6 text-foreground"
    >
      <ThemePicker
        preset={brand}
        onPresetChange={setBrand}
        scheme={mode}
        onSchemeChange={setMode}
        presets={presets}
        label="Customize theme"
      >
        <div class="grid gap-4 p-3">
          <div class="grid gap-2">
            <Label for="theme-radius">Radius ({corner.toFixed(3)}rem)</Label>
            <Slider
              id="theme-radius"
              min={0}
              max={1.25}
              step={0.125}
              value={corner}
              onValueChange={(values) => setCorner(values[0] ?? corner)}
              aria-label="Corner radius"
            />
          </div>
          <div class="flex gap-2">
            <CopyButton value={cssSnippet} label="Copy CSS" subject="CSS" />
            <Button size="sm" variant="outline" onClick={onReset}>
              Reset
            </Button>
          </div>
        </div>
      </ThemePicker>
    </div>
  );
};
