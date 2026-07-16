import { generateTypesetPreset } from "./generator";
import type { TypesetPreset } from "./types";

export const typesetPresets = [
  {
    id: "default",
    label: "Default",
    description: "Neutral content styling that follows the surrounding font size.",
    className: "typeset",
    values: { size: "1em", leading: 1.75, flow: "1.25em", measure: "none" },
  },
  {
    id: "docs",
    label: "Docs",
    description: "Compact, scannable rhythm for technical documentation.",
    className: "typeset-docs",
    values: { size: "0.95rem", leading: 1.7, flow: "1.1em", measure: "78ch" },
  },
  {
    id: "reading",
    label: "Reading",
    description: "Generous long-form article rhythm with a comfortable measure.",
    className: "typeset-reading",
    values: {
      size: "clamp(1.05rem, 1rem + 0.25vw, 1.2rem)",
      leading: 1.85,
      flow: "1.45em",
      measure: "68ch",
    },
  },
  {
    id: "chat",
    label: "Chat",
    description: "Compact streaming-safe rhythm for chat and AI messages.",
    className: "typeset-chat",
    values: { size: "1em", leading: 1.6, flow: "0.85em", measure: "none" },
  },
  {
    id: "compact",
    label: "Compact",
    description: "Small content rhythm for sidebars, popovers and dense panels.",
    className: "typeset-compact",
    values: { size: "0.875rem", leading: 1.55, flow: "0.8em", measure: "none" },
  },
  {
    id: "large",
    label: "Large",
    description: "Accessible reader rhythm with larger type and spacing.",
    className: "typeset-large",
    values: {
      size: "clamp(1.125rem, 1.05rem + 0.45vw, 1.35rem)",
      leading: 1.9,
      flow: "1.6em",
      measure: "72ch",
    },
  },
] as const satisfies readonly TypesetPreset[];

export function generateTypesetPresetsCss(
  presets: readonly TypesetPreset[] = typesetPresets,
): string {
  return presets
    .filter((preset) => preset.id !== "default")
    .map((preset) => generateTypesetPreset({ name: preset.id, ...preset.values }))
    .join("\n");
}
