import {
  CheckIcon,
  CodeIcon,
  EyeIcon,
  MoonIcon,
  PaletteIcon,
  RefreshCwIcon,
  SparklesIcon,
  SunIcon,
} from "@kamod-ch/icons/lucide";
import { ArrowsMaximizeIcon } from "@kamod-ch/icons/tabler/outline";
import { isThemePresetId, THEME_PRESETS } from "@kamod-ch/themes";
import { TabsList, TabsTrigger } from "@kamod-ch/ui";
import { useTabs } from "@kamod-ch/ui/tabs";
import { type BlockPreviewViewport, BlockViewportSwitcher } from "./BlockViewportSwitcher";
import type { PreviewAppearance } from "./preview-appearance";
import type { PreviewRefreshPhase } from "./usePreviewRefresh";

function RefreshControl({
  phase,
  onRefresh,
}: {
  phase: PreviewRefreshPhase;
  onRefresh: () => boolean;
}) {
  const { setValue } = useTabs();
  const label =
    phase === "loading" ? "Refreshing…" : phase === "complete" ? "Refreshed" : "Refresh";
  return (
    <>
      <button
        type="button"
        class="blocks-showcase-control blocks-showcase-refresh"
        data-refresh-state={phase}
        disabled={phase !== "idle"}
        aria-busy={phase === "loading"}
        aria-label={label}
        title="Reload the preview and reset its demo state"
        onClick={() => {
          if (onRefresh()) setValue("preview");
        }}
      >
        <span class="blocks-showcase-refresh-icon" aria-hidden="true">
          <RefreshCwIcon class="blocks-showcase-refresh-spinner" />
          <CheckIcon class="blocks-showcase-refresh-check" />
        </span>
        <span class="blocks-showcase-refresh-label blocks-showcase-control-label">
          <span aria-hidden="true">Refreshing…</span>
          <span>{label}</span>
        </span>
      </button>
      <span class="sr-only" role="status">
        {phase === "loading"
          ? "Refreshing preview."
          : phase === "complete"
            ? "Preview refreshed."
            : ""}
      </span>
    </>
  );
}

function PreviewAppearanceControls({
  value,
  onChange,
}: {
  value: PreviewAppearance;
  onChange: (value: PreviewAppearance) => void;
}) {
  const isDark = value.scheme === "dark";
  const SchemeIcon = isDark ? MoonIcon : SunIcon;
  const presetLabel = THEME_PRESETS.find((preset) => preset.id === value.preset)!.label;
  return (
    <div
      class="blocks-showcase-segmented blocks-showcase-appearance"
      role="group"
      aria-label="Preview appearance"
    >
      <button
        type="button"
        class="blocks-showcase-control"
        aria-label="Dark preview"
        aria-pressed={isDark}
        title={`Switch preview to ${isDark ? "light" : "dark"} mode`}
        onClick={() => onChange({ ...value, scheme: isDark ? "light" : "dark" })}
      >
        <SchemeIcon size={17} aria-hidden="true" />
      </button>
      <label
        class="blocks-showcase-preset blocks-showcase-control"
        title={`Preview theme: ${presetLabel}`}
      >
        <PaletteIcon size={17} aria-hidden="true" />
        <span class="blocks-showcase-control-label" aria-hidden="true">
          {presetLabel}
        </span>
        <select
          aria-label="Preview color theme"
          value={value.preset}
          onChange={(event) => {
            const preset = event.currentTarget.value;
            if (isThemePresetId(preset)) onChange({ ...value, preset });
          }}
        >
          {THEME_PRESETS.map(({ id, label }) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

/** One shared toolbar; viewport and appearance controls remain available across all three tabs. */
export function BlockShowcaseToolbar({
  viewport,
  availableWidth,
  onViewportChange,
  appearance,
  onAppearanceChange,
  previewUrl,
  refreshPhase,
  onRefresh,
}: {
  viewport: BlockPreviewViewport;
  availableWidth: number;
  onViewportChange: (value: BlockPreviewViewport) => void;
  appearance: PreviewAppearance;
  onAppearanceChange: (value: PreviewAppearance) => void;
  previewUrl: string;
  refreshPhase: PreviewRefreshPhase;
  onRefresh: () => boolean;
}) {
  return (
    <div class="blocks-showcase-toolbar">
      <div class="blocks-showcase-views">
        <TabsList class="blocks-showcase-segmented" aria-label="Showcase view">
          <TabsTrigger value="preview" aria-label="Preview" title="Preview">
            <EyeIcon aria-hidden="true" />
            <span class="blocks-showcase-control-label">Preview</span>
          </TabsTrigger>
          <TabsTrigger value="code" aria-label="Code" title="Code">
            <CodeIcon aria-hidden="true" />
            <span class="blocks-showcase-control-label">Code</span>
          </TabsTrigger>
          <TabsTrigger value="prompt" aria-label="Prompt" title="Prompt">
            <SparklesIcon aria-hidden="true" />
            <span class="blocks-showcase-control-label">Prompt</span>
          </TabsTrigger>
        </TabsList>
        <div class="blocks-showcase-segmented" role="group" aria-label="Preview actions">
          <RefreshControl phase={refreshPhase} onRefresh={onRefresh} />
          <a
            class="blocks-showcase-control"
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            title="Open the preview in a new tab"
            aria-label="Open preview in a new tab"
          >
            <ArrowsMaximizeIcon aria-hidden="true" />
            <span class="blocks-showcase-control-label">Open</span>
          </a>
        </div>
      </div>
      <div class="blocks-showcase-settings">
        <BlockViewportSwitcher
          value={viewport}
          availableWidth={availableWidth}
          onValueChange={onViewportChange}
        />
        <PreviewAppearanceControls value={appearance} onChange={onAppearanceChange} />
      </div>
    </div>
  );
}
