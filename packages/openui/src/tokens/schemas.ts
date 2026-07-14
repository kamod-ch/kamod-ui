import { z } from "zod";

export const spacingSchema = z.enum(["none", "xs", "sm", "md", "lg", "xl"]).default("md");
export type SpacingToken = z.infer<typeof spacingSchema>;

export const toneSchema = z
  .enum(["neutral", "info", "success", "warning", "danger"])
  .default("neutral");
export type ToneToken = z.infer<typeof toneSchema>;

export const alignmentSchema = z.enum(["start", "center", "end", "stretch"]).default("start");
export type AlignmentToken = z.infer<typeof alignmentSchema>;

export const widthSchema = z.enum(["auto", "full", "content"]).default("auto");
export type WidthToken = z.infer<typeof widthSchema>;

export const textToneSchema = z.enum(["default", "muted", "lead", "small"]).default("default");
export type TextToneToken = z.infer<typeof textToneSchema>;

export const headingLevelSchema = z.enum(["1", "2", "3", "4"]).default("2");
export type HeadingLevelToken = z.infer<typeof headingLevelSchema>;
