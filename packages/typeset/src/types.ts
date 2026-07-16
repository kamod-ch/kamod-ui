export type TypesetPresetId = "default" | "docs" | "reading" | "chat" | "compact" | "large";

export interface TypesetPresetValues {
  size: string;
  leading: number;
  flow: string;
  measure?: string;
  bodyFont?: string;
  headingFont?: string;
  monoFont?: string;
}

export interface TypesetPreset {
  id: TypesetPresetId;
  label: string;
  description: string;
  className: string;
  values: TypesetPresetValues;
}

export interface GenerateTypesetPresetOptions extends Partial<TypesetPresetValues> {
  name: string;
}
