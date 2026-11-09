/** Map lucide-style symbol names used in docs to `@kamod-ch/icons/lucide` exports. */

const MANUAL: Record<string, string> = {
  AlignLeft: "TextAlignStartIcon",
  AlignRight: "TextAlignEndIcon",
  AlignCenter: "TextAlignCenterIcon",
  CheckCircle2: "CircleCheckIcon",
  AlertCircle: "CircleAlertIcon",
  AlertTriangle: "TriangleAlertIcon",
  Loader2: "LoaderCircleIcon",
  MoreHorizontal: "EllipsisIcon",
  HelpCircle: "CircleQuestionMarkIcon",
  Calendar: "CalendarIcon",
  Home: "HouseIcon",
};

export function lucideSymbolToKamodExport(symbol: string): string {
  const base =
    symbol
      .trim()
      .split(/\s+as\s+/i)[0]
      ?.trim() ?? "";
  if (!base) return symbol;
  if (MANUAL[base]) return symbol.replace(base, MANUAL[base]);
  if (base.endsWith("Icon")) return symbol;
  return symbol.replace(base, `${base}Icon`);
}

export function lucideImportNames(symbols: string[]): string[] {
  return symbols.map(lucideSymbolToKamodExport);
}
