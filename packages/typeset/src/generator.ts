import type { GenerateTypesetPresetOptions, TypesetPresetValues } from "./types";

const CSS_VALUE_PATTERN = /^[a-zA-Z0-9\s.,%#()\-+/*_"']+$/;
const CSS_IDENTIFIER_PATTERN = /^[a-z][a-z0-9-]*$/;

const propertyMap: Array<[keyof TypesetPresetValues, string]> = [
  ["size", "--typeset-size"],
  ["leading", "--typeset-leading"],
  ["flow", "--typeset-flow"],
  ["measure", "--typeset-measure"],
  ["bodyFont", "--typeset-font-body"],
  ["headingFont", "--typeset-font-heading"],
  ["monoFont", "--typeset-font-mono"],
];

export function normalizeTypesetPresetName(name: string): string {
  const normalized = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/_/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!CSS_IDENTIFIER_PATTERN.test(normalized)) {
    throw new Error(`Invalid typeset preset name: ${name}`);
  }
  if (normalized === "default" || normalized === "typeset") {
    throw new Error(`Reserved typeset preset name: ${name}`);
  }
  return normalized;
}

function assertCssValue(property: string, value: string | number): string {
  const serialized = String(value).trim();
  if (!serialized || serialized.length > 160) {
    throw new Error(`Invalid CSS value for ${property}`);
  }
  if (/[;{}<>`\\]/.test(serialized) || !CSS_VALUE_PATTERN.test(serialized)) {
    throw new Error(`Unsafe CSS value for ${property}`);
  }
  return serialized;
}

function assertLeading(value: number | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (!Number.isFinite(value) || value < 1 || value > 3) {
    throw new Error("--typeset-leading must be a finite number between 1 and 3");
  }
  return String(value);
}

export function generateTypesetPreset(options: GenerateTypesetPresetOptions): string {
  const name = normalizeTypesetPresetName(options.name);
  const lines = [`.typeset-${name} {`];

  for (const [key, property] of propertyMap) {
    const raw = options[key];
    if (raw === undefined) continue;
    const value = key === "leading" ? assertLeading(raw as number) : assertCssValue(property, raw);
    if (value !== undefined) lines.push(`  ${property}: ${value};`);
  }

  if (lines.length === 1) {
    throw new Error("A typeset preset must set at least one value");
  }

  lines.push("}");
  return `${lines.join("\n")}\n`;
}
