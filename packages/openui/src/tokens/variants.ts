import type { AlignmentToken, SpacingToken, TextToneToken, ToneToken, WidthToken } from "./schemas";

export const spacingGapClass: Record<SpacingToken, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

export const alignmentClass: Record<AlignmentToken, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

export const justifyClass: Record<AlignmentToken, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  stretch: "justify-stretch",
};

export const widthClass: Record<WidthToken, string> = {
  auto: "w-auto",
  full: "w-full",
  content: "w-fit",
};

export const toneToAlertVariant: Record<
  ToneToken,
  "default" | "info" | "success" | "warning" | "error"
> = {
  neutral: "default",
  info: "info",
  success: "success",
  warning: "warning",
  danger: "error",
};

export const toneToBadgeVariant: Record<
  ToneToken,
  "default" | "info" | "success" | "warning" | "error"
> = {
  neutral: "default",
  info: "info",
  success: "success",
  warning: "warning",
  danger: "error",
};

export const textToneToTypography: Record<TextToneToken, "p" | "muted" | "lead" | "small"> = {
  default: "p",
  muted: "muted",
  lead: "lead",
  small: "small",
};

export const buttonVariantSchemaValues = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
] as const;

export const buttonSizeSchemaValues = ["sm", "md", "lg"] as const;

export const buttonSizeToKamod: Record<
  (typeof buttonSizeSchemaValues)[number],
  "sm" | "default" | "lg"
> = {
  sm: "sm",
  md: "default",
  lg: "lg",
};

export const gridColsClass: Record<1 | 2 | 3 | 4, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};
