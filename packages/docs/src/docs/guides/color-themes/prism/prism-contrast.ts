type Color = [number, number, number, number];
const savedColorNames: Record<string, string> = {
  black: "#000000",
  white: "#ffffff",
  slategray: "#708090",
  yellow: "#ffff00",
  yellowgreen: "#9acd32",
  deeppink: "#ff1493",
  orange: "#ffa500",
  red: "#ff0000",
  green: "#008000",
};

/** Resolve the literal sRGB formats used by the saved upstream palettes, without DOM probes. */
function channels(value: string): Color | undefined {
  const color = value.trim().toLowerCase();
  if (Object.hasOwn(savedColorNames, color)) return channels(savedColorNames[color]);
  if (color === "transparent") return [0, 0, 0, 0];
  if (/^#[\da-f]{3,4}$/.test(color)) {
    return channels(
      `#${color
        .slice(1)
        .split("")
        .map((digit) => `${digit}${digit}`)
        .join("")}`,
    );
  }
  if (/^#[\da-f]{6}([\da-f]{2})?$/.test(color)) {
    const rgb = [1, 3, 5].map((offset) => Number.parseInt(color.slice(offset, offset + 2), 16));
    return [...rgb, color.length === 9 ? Number.parseInt(color.slice(7), 16) / 255 : 1] as Color;
  }
  const functional = color.match(/^(rgba?|hsla?)\(([^)]+)\)$/);
  if (!functional) return undefined;
  const parts = functional[2].trim().split(/[\s,/]+/);
  if (parts.length < 3 || parts.length > 4) return undefined;
  const numbers = parts.map(Number.parseFloat);
  if (numbers.some((part) => !Number.isFinite(part))) return undefined;
  const alpha = parts[3]?.endsWith("%") ? numbers[3] / 100 : (numbers[3] ?? 1);
  if (alpha < 0 || alpha > 1) return undefined;
  if (functional[1].startsWith("rgb")) {
    const rgb = numbers
      .slice(0, 3)
      .map((part, index) => (parts[index].endsWith("%") ? (part / 100) * 255 : part));
    if (rgb.some((part) => part < 0 || part > 255)) return undefined;
    return [...rgb, alpha] as Color;
  }
  if (!parts[1].endsWith("%") || !parts[2].endsWith("%")) return undefined;
  const hueUnit = parts[0].replace(/^[+-]?[\d.]+/, "");
  const degrees =
    hueUnit === "turn"
      ? numbers[0] * 360
      : hueUnit === "rad"
        ? (numbers[0] * 180) / Math.PI
        : hueUnit === "grad"
          ? numbers[0] * 0.9
          : numbers[0];
  if (!["", "deg", "turn", "rad", "grad"].includes(hueUnit)) return undefined;
  const h = ((degrees % 360) + 360) % 360;
  const s = numbers[1] / 100;
  const l = numbers[2] / 100;
  if (s < 0 || s > 1 || l < 0 || l > 1) return undefined;
  const a = s * Math.min(l, 1 - l);
  const channel = (offset: number) => {
    const k = (offset + h / 30) % 12;
    return 255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)));
  };
  return [channel(0), channel(8), channel(4), alpha];
}

const luminance = (rgb: number[]) =>
  rgb.reduce((sum, channel, index) => {
    const normalized = channel / 255;
    const linear =
      normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
    return sum + linear * [0.2126, 0.7152, 0.0722][index];
  }, 0);

/** Ink on the source canvas only; preserves the source colors, including translucent ink. */
export function prismInkContrast(ink: string, canvas: string): number | undefined {
  const foreground = channels(ink);
  const background = channels(canvas);
  if (!foreground || !background || background[3] !== 1) return undefined;
  const composite = foreground
    .slice(0, 3)
    .map((part, index) => part * foreground[3] + background[index] * (1 - foreground[3]));
  const first = luminance(composite);
  const second = luminance(background.slice(0, 3));
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}
