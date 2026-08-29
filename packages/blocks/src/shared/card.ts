export type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "unknown";

export const digitsOnly = (value: string): string => value.replace(/\D/g, "");

export const luhnCheck = (pan: string): boolean => {
  const digits = digitsOnly(pan);
  if (digits.length < 12 || digits.length > 19) return false;

  let sum = 0;
  let doubleDigit = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let n = Number(digits[index]);
    if (doubleDigit) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    doubleDigit = !doubleDigit;
  }
  return sum % 10 === 0;
};

export const detectCardBrand = (pan: string): CardBrand => {
  const digits = digitsOnly(pan);
  if (digits.startsWith("34") || digits.startsWith("37")) return "amex";
  if (digits.startsWith("4")) return "visa";

  const prefix2 = Number(digits.slice(0, 2));
  const prefix3 = Number(digits.slice(0, 3));
  const prefix4 = Number(digits.slice(0, 4));
  const prefix6 = Number(digits.slice(0, 6));
  if ((prefix2 >= 51 && prefix2 <= 55) || (prefix4 >= 2221 && prefix4 <= 2720)) {
    return "mastercard";
  }
  if (
    digits.startsWith("6011") ||
    digits.startsWith("65") ||
    (prefix3 >= 644 && prefix3 <= 649) ||
    (prefix6 >= 622126 && prefix6 <= 622925)
  ) {
    return "discover";
  }
  return "unknown";
};

export const validateExpiry = (month: string, year: string, now: Date = new Date()): boolean => {
  const parsedMonth = Number(month);
  const parsedYear = Number(year.length === 2 ? `20${year}` : year);
  if (!Number.isInteger(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) return false;
  if (!Number.isInteger(parsedYear) || parsedYear < 2000 || parsedYear > 2100) return false;

  const expiresAt = new Date(parsedYear, parsedMonth, 0, 23, 59, 59, 999);
  return expiresAt.getTime() >= now.getTime();
};

export const validateCvc = (cvc: string, brand: CardBrand = "unknown"): boolean => {
  const digits = digitsOnly(cvc);
  return brand === "amex" ? digits.length === 4 : digits.length === 3;
};

/** Mask a PAN for display. Never log or persist the raw input. */
export const maskPan = (pan: string): string => {
  const digits = digitsOnly(pan);
  const last4 = digits.slice(-4);
  if (digits.length <= 4) return last4;
  return `•••• ${last4}`;
};

export const panMaxLength = (brand: CardBrand): number => (brand === "amex" ? 15 : 16);

export const formatPanGroups = (pan: string, brand: CardBrand = detectCardBrand(pan)): string => {
  const digits = digitsOnly(pan).slice(0, brand === "amex" ? 15 : 19);
  if (brand === "amex") {
    return [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10, 15)]
      .filter(Boolean)
      .join(" ");
  }
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
};
