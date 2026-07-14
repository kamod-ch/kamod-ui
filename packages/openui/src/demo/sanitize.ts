/**
 * Strip markdown fences and trim LLM OpenUI Lang / JSON payloads.
 */
export function sanitizeOpenUILang(raw: string): string {
  let text = raw.trim();
  if (!text) return "";

  const fenced = text.match(/^```(?:lang|openui|text|typescript|ts|js)?\s*\n?([\s\S]*?)\n?```$/i);
  if (fenced?.[1]) {
    text = fenced[1].trim();
  } else {
    text = text
      .replace(/^```(?:lang|openui|text)?\s*\n?/i, "")
      .replace(/\n?```$/i, "")
      .trim();
  }

  return text;
}

/**
 * Extract the first JSON object from a model response (fences or prose noise).
 */
export function sanitizeJsonPayload(raw: string): string {
  const cleaned = sanitizeOpenUILang(raw);
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    return cleaned;
  }
  return cleaned.slice(start, end + 1);
}
