/** Digits only (0–9), for PIN / SMS codes. */
export const REGEXP_ONLY_DIGITS = /^[0-9]*$/;

/** Letters and digits (ASCII), for alphanumeric OTPs. */
export const REGEXP_ONLY_DIGITS_AND_CHARS = /^[a-zA-Z0-9]*$/;

export const filterOtpValue = (raw: string, pattern?: RegExp): string => {
  if (!pattern) return raw;
  if (pattern === REGEXP_ONLY_DIGITS) return raw.replace(/\D/g, "");
  if (pattern === REGEXP_ONLY_DIGITS_AND_CHARS) return raw.replace(/[^a-zA-Z0-9]/g, "");
  let out = "";
  for (const ch of raw) {
    const next = out + ch;
    if (pattern.test(next)) out = next;
  }
  return out;
};
