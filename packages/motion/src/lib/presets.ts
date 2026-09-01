import {
  fade,
  type Preset,
  scale,
  slideDown,
  slideLeft,
  slideRight,
  slideUp,
} from "@kamod-ch/motion/presets";

export { fade, scale };

export const sheetPresets = {
  right: slideLeft,
  left: slideRight,
  top: slideDown,
  bottom: slideUp,
} as const satisfies Record<string, Preset>;

export type SheetSide = keyof typeof sheetPresets;

export function sheetPreset(side: SheetSide): Preset {
  return sheetPresets[side];
}
