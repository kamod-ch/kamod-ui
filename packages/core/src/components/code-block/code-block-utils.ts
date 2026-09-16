export const sanitizeCodeLanguage = (language?: string): string | undefined => {
  if (!language) return undefined;
  const safe = language
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9+#.-]/g, "");
  return safe || undefined;
};

export const splitCodeLines = (code: string): string[] => code.split("\n");
