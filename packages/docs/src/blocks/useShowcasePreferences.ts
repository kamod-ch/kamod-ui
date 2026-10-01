/** Persist each showcase's controls without changing the surrounding site's preferences. */
import { useLocalStorageState } from "@kamod-ch/hooks";
import { isThemePresetId } from "@kamod-ch/themes";
import { useEffect, useLayoutEffect, useState } from "preact/hooks";
import type { BlockPreviewViewport } from "./BlockViewportSwitcher";
import type { BlockPromptMode } from "./block-prompts";
import type { PromptDisplay } from "./PromptDocument";
import type { PreviewAppearance } from "./preview-appearance";

export type ShowcasePreferences = {
  view: "preview" | "code" | "prompt";
  viewport: BlockPreviewViewport;
  appearance: PreviewAppearance;
  promptMode: BlockPromptMode;
  promptDisplay: PromptDisplay;
};

/** Validate fields independently so obsolete or malformed preferences cannot break the page. */
export function parseShowcasePreferences(raw: string): Partial<ShowcasePreferences> {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return {};
  }
  if (!value || typeof value !== "object") return {};
  const stored = value as Record<string, unknown>;
  const result: Partial<ShowcasePreferences> = {};
  if (
    stored.promptDisplay === "text" ||
    stored.promptDisplay === "code" ||
    stored.promptDisplay === "markdown"
  ) {
    result.promptDisplay = stored.promptDisplay;
  }
  if (stored.promptMode === "setup" || stored.promptMode === "adapt") {
    result.promptMode = stored.promptMode;
  }
  if (stored.view === "preview" || stored.view === "code" || stored.view === "prompt") {
    result.view = stored.view;
  }
  if (
    stored.viewport === "desktop" ||
    stored.viewport === "tablet" ||
    stored.viewport === "mobile"
  ) {
    result.viewport = stored.viewport;
  }
  if (stored.appearance && typeof stored.appearance === "object") {
    const { preset, scheme } = stored.appearance as Record<string, unknown>;
    if (
      typeof preset === "string" &&
      isThemePresetId(preset) &&
      (scheme === "light" || scheme === "dark")
    ) {
      result.appearance = { preset, scheme };
    }
  }
  return result;
}

export function useShowcasePreferences(category: string, id: string) {
  const [stored, setStored] = useLocalStorageState<Partial<ShowcasePreferences>>(
    `kamod:block-showcase:v1:${category}/${id}`,
    {
      defaultValue: {},
      getInitialValueInEffect: true,
      deserializer: parseShowcasePreferences,
      // Storage can be blocked or full; controls must still work in memory.
      onError: () => {},
    },
  );
  const [initialAppearance, setInitialAppearance] = useState<PreviewAppearance>({
    preset: "kamod",
    scheme: "light",
  });
  const [ready, setReady] = useState(false);
  // Read the applied page theme before paint; inherited appearance is not a saved override.
  useLayoutEffect(() => {
    const root = document.documentElement;
    const preset = root.getAttribute("data-theme") ?? "";
    setInitialAppearance({
      preset: isThemePresetId(preset) ? preset : "kamod",
      scheme: root.classList.contains("dark") ? "dark" : "light",
    });
  }, []);
  // The storage hook restores saved controls in its mount effect first.
  useEffect(() => setReady(true), []);

  const preferences: ShowcasePreferences = {
    view: "preview",
    viewport: "desktop",
    appearance: initialAppearance,
    promptMode: "setup",
    promptDisplay: "text",
    ...stored,
  };
  const update = (patch: Partial<ShowcasePreferences>) => {
    setStored((previous) => ({ ...previous, ...patch }));
  };
  return { preferences, update, ready };
}
