const ACRONYMS = new Map([
  ["ai", "AI"],
  ["api", "API"],
  ["css", "CSS"],
  ["cta", "CTA"],
  ["faq", "FAQ"],
  ["id", "ID"],
  ["llm", "LLM"],
  ["mfa", "MFA"],
  ["otp", "OTP"],
  ["ui", "UI"],
  ["url", "URL"],
]);

/** Turn a route id such as `application-shell-01` into a document title. */
export function humanizeRouteId(id) {
  return id
    .split("-")
    .filter(Boolean)
    .map((part) => {
      if (/^\d+$/.test(part)) return String(Number(part));
      return ACRONYMS.get(part) ?? part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
}

export function clipPlainText(text, max = 155) {
  const clean = text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  const trimmed = (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim();
  return `${trimmed}…`;
}
